import { config } from "./config";

// 비용 모니터링 인터페이스
interface CostInfo {
  tokens: number;
  estimatedCost: number;
  timestamp: number;
}

interface DailyCost {
  date: string;
  totalTokens: number;
  totalCost: number;
  requestCount: number;
}

// 비용 모니터링 클래스
export class CostMonitor {
  private static instance: CostMonitor;
  private dailyCosts: Map<string, DailyCost> = new Map();

  // GPT-4o-mini 가격 (2024년 기준, 1000토큰당)
  private readonly PRICE_PER_1K_TOKENS = 0.00015; // $0.15 per 1K tokens

  private constructor() {
    this.loadDailyCosts();
  }

  static getInstance(): CostMonitor {
    if (!CostMonitor.instance) {
      CostMonitor.instance = new CostMonitor();
    }
    return CostMonitor.instance;
  }

  /**
   * 비용 기록
   */
  recordCost(tokens: number, userId?: string): void {
    if (!config.enableCostMonitoring) {
      return;
    }

    const cost = this.calculateCost(tokens);
    const today = new Date().toISOString().split("T")[0];

    // 일일 비용 업데이트
    const existingCost = this.dailyCosts.get(today) || {
      date: today,
      totalTokens: 0,
      totalCost: 0,
      requestCount: 0,
    };

    existingCost.totalTokens += tokens;
    existingCost.totalCost += cost;
    existingCost.requestCount += 1;

    this.dailyCosts.set(today, existingCost);
    this.saveDailyCosts();

    // 비용 알림 체크
    this.checkCostAlerts(existingCost);

    // 개발 환경에서만 로그
    if (config.environment === "development") {
      console.log(
        `💰 비용 기록: ${tokens}토큰, $${cost.toFixed(4)}, 사용자: ${userId || "unknown"}`
      );
    }
  }

  /**
   * 비용 계산
   */
  private calculateCost(tokens: number): number {
    return (tokens / 1000) * this.PRICE_PER_1K_TOKENS;
  }

  /**
   * 비용 알림 체크
   */
  private checkCostAlerts(dailyCost: DailyCost): void {
    const { totalCost } = dailyCost;

    // 일일 한도 체크
    if (totalCost >= config.dailyCostLimit) {
      console.warn(
        `⚠️ 일일 비용 한도 도달: $${totalCost.toFixed(2)} / $${config.dailyCostLimit}`
      );
      this.sendCostAlert("일일 비용 한도", totalCost, config.dailyCostLimit);
    }

    // 비용 알림 임계값 체크
    if (totalCost >= config.costAlertThreshold) {
      console.warn(`⚠️ 비용 알림 임계값 도달: $${totalCost.toFixed(2)}`);
      this.sendCostAlert(
        "비용 알림 임계값",
        totalCost,
        config.costAlertThreshold
      );
    }
  }

  /**
   * 비용 알림 전송
   */
  private sendCostAlert(type: string, current: number, limit: number): void {
    // 실제 구현에서는 이메일, 슬랙, 디스코드 등으로 알림 전송
    console.error(`🚨 ${type} 알림: $${current.toFixed(2)} / $${limit}`);

    // 브라우저 환경에서는 알림 표시
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(`ToneTuner ${type}`, {
          body: `현재 비용: $${current.toFixed(2)} / 한도: $${limit}`,
          icon: "/favicon.png",
        });
      }
    }
  }

  /**
   * 일일 비용 조회
   */
  getDailyCost(date?: string): DailyCost | null {
    const targetDate = date || new Date().toISOString().split("T")[0];
    return this.dailyCosts.get(targetDate) || null;
  }

  /**
   * 월간 비용 조회
   */
  getMonthlyCost(year?: number, month?: number): DailyCost {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    const monthlyCost: DailyCost = {
      date: `${targetYear}-${targetMonth.toString().padStart(2, "0")}`,
      totalTokens: 0,
      totalCost: 0,
      requestCount: 0,
    };

    // 해당 월의 모든 일일 비용 합산
    for (const [date, dailyCost] of this.dailyCosts) {
      const costDate = new Date(date);
      if (
        costDate.getFullYear() === targetYear &&
        costDate.getMonth() + 1 === targetMonth
      ) {
        monthlyCost.totalTokens += dailyCost.totalTokens;
        monthlyCost.totalCost += dailyCost.totalCost;
        monthlyCost.requestCount += dailyCost.requestCount;
      }
    }

    return monthlyCost;
  }

  /**
   * 비용 통계 조회
   */
  getCostStats(): {
    today: DailyCost | null;
    thisMonth: DailyCost;
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
  } {
    const today = this.getDailyCost();
    const thisMonth = this.getMonthlyCost();

    let totalRequests = 0;
    let totalTokens = 0;
    let totalCost = 0;

    for (const dailyCost of this.dailyCosts.values()) {
      totalRequests += dailyCost.requestCount;
      totalTokens += dailyCost.totalTokens;
      totalCost += dailyCost.totalCost;
    }

    return {
      today,
      thisMonth,
      totalRequests,
      totalTokens,
      totalCost,
    };
  }

  /**
   * 일일 비용 데이터 로드
   */
  private loadDailyCosts(): void {
    if (typeof window === "undefined") {
      return; // 서버 사이드에서는 로드하지 않음
    }

    try {
      const stored = localStorage.getItem("tonetuner_daily_costs");
      if (stored) {
        const data = JSON.parse(stored);
        this.dailyCosts = new Map(data);
      }
    } catch (error) {
      console.error("일일 비용 데이터 로드 실패:", error);
    }
  }

  /**
   * 일일 비용 데이터 저장
   */
  private saveDailyCosts(): void {
    if (typeof window === "undefined") {
      return; // 서버 사이드에서는 저장하지 않음
    }

    try {
      const data = Array.from(this.dailyCosts.entries());
      localStorage.setItem("tonetuner_daily_costs", JSON.stringify(data));
    } catch (error) {
      console.error("일일 비용 데이터 저장 실패:", error);
    }
  }

  /**
   * 오래된 데이터 정리 (30일 이상)
   */
  cleanupOldData(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const [date] of this.dailyCosts) {
      const costDate = new Date(date);
      if (costDate < thirtyDaysAgo) {
        this.dailyCosts.delete(date);
      }
    }

    this.saveDailyCosts();
  }

  /**
   * 비용 리셋 (개발/테스트용)
   */
  resetCosts(): void {
    this.dailyCosts.clear();
    this.saveDailyCosts();
    console.log("💰 비용 데이터가 리셋되었습니다.");
  }
}

// 싱글톤 인스턴스
export const costMonitor = CostMonitor.getInstance();
