import { config } from "./config";
import { costMonitor } from "./costMonitor";
import { rateLimiter } from "./rateLimiter";

/**
 * 관리자용 로그 및 모니터링 유틸리티
 */
export class AdminLogger {
  /**
   * 사용자별 상세 현황 조회
   */
  static async getUserDetailedStatus(userId: string): Promise<void> {
    try {
      console.log(`\n📊 사용자 상세 현황 조회: ${userId}`);
      console.log("=".repeat(50));

      // 요청 현황
      const requestStatus = await rateLimiter.getUserRequestStatus(userId);
      console.log("📈 요청 현황:");
      console.log(
        `  분당: ${requestStatus.minute.current}/${requestStatus.minute.limit} (${requestStatus.minute.remaining} 남음)`
      );
      console.log(
        `  시간당: ${requestStatus.hour.current}/${requestStatus.hour.limit} (${requestStatus.hour.remaining} 남음)`
      );
      console.log(
        `  일당: ${requestStatus.day.current}/${requestStatus.day.limit} (${requestStatus.day.remaining} 남음)`
      );

      // 토큰 사용 현황
      const tokenStatus = await rateLimiter.getUserTokenStatus(userId);
      console.log("🎯 토큰 사용 현황:");
      console.log(
        `  분당: ${tokenStatus.minute.current}/${tokenStatus.minute.limit} (${tokenStatus.minute.remaining} 남음)`
      );
      console.log(
        `  시간당: ${tokenStatus.hour.current}/${tokenStatus.hour.limit} (${tokenStatus.hour.remaining} 남음)`
      );
      console.log(
        `  일당: ${tokenStatus.day.current}/${tokenStatus.day.limit} (${tokenStatus.day.remaining} 남음)`
      );

      // 비용 현황 (활성화된 경우)
      if (config.enableCostMonitoring) {
        const costStats = costMonitor.getCostStats();
        console.log("💰 비용 현황:");
        console.log(
          `  오늘: $${costStats.today?.totalCost.toFixed(4) || "0.0000"} (${costStats.today?.requestCount || 0}회)`
        );
        console.log(
          `  이번 달: $${costStats.thisMonth.totalCost.toFixed(4)} (${costStats.thisMonth.requestCount}회)`
        );
        console.log(
          `  총 비용: $${costStats.totalCost.toFixed(4)} (${costStats.totalRequests}회)`
        );
      }

      console.log("=".repeat(50));
    } catch (error) {
      console.error("사용자 현황 조회 실패:", error);
    }
  }

  /**
   * 전체 시스템 현황 조회
   */
  static async getSystemStatus(): Promise<void> {
    try {
      console.log("\n🔍 전체 시스템 현황");
      console.log("=".repeat(50));

      // 설정 정보
      console.log("⚙️ 현재 설정:");
      console.log(
        `  Rate Limiting: ${config.enableRateLimit ? "활성화" : "비활성화"}`
      );
      console.log(
        `  비용 모니터링: ${config.enableCostMonitoring ? "활성화" : "비활성화"}`
      );
      console.log(`  최대 토큰/요청: ${config.maxTokensPerRequest}`);
      console.log(
        `  사용자 제한 (분/시/일): ${config.userRateLimits.requestsPerMinute}/${config.userRateLimits.requestsPerHour}/${config.userRateLimits.requestsPerDay}`
      );

      // 비용 현황 (활성화된 경우)
      if (config.enableCostMonitoring) {
        const costStats = costMonitor.getCostStats();
        console.log("\n💰 비용 현황:");
        console.log(
          `  오늘: $${costStats.today?.totalCost.toFixed(4) || "0.0000"} (${costStats.today?.requestCount || 0}회)`
        );
        console.log(
          `  이번 달: $${costStats.thisMonth.totalCost.toFixed(4)} (${costStats.thisMonth.requestCount}회)`
        );
        console.log(
          `  총 비용: $${costStats.totalCost.toFixed(4)} (${costStats.totalRequests}회)`
        );
        console.log(`  일일 한도: $${config.dailyCostLimit}`);
        console.log(`  월간 한도: $${config.monthlyCostLimit}`);
      }

      console.log("=".repeat(50));
    } catch (error) {
      console.error("시스템 현황 조회 실패:", error);
    }
  }

  /**
   * Redis 카운터 조회 예시 (실제 Redis 연동 시 사용)
   */
  static async getRedisCounters(userId: string): Promise<void> {
    console.log(`\n🔍 Redis 카운터 조회 예시: ${userId}`);
    console.log("=".repeat(50));

    // 실제 Redis 연동 시 사용할 명령어들
    console.log("Redis 명령어 예시:");
    console.log(`  # 사용자별 요청 카운터 조회`);
    console.log(`  GET ${config.redis.keyPrefix}rate_limit:${userId}:minute`);
    console.log(`  GET ${config.redis.keyPrefix}rate_limit:${userId}:hour`);
    console.log(`  GET ${config.redis.keyPrefix}rate_limit:${userId}:day`);
    console.log(`  `);
    console.log(`  # 사용자별 토큰 사용량 조회`);
    console.log(`  GET ${config.redis.keyPrefix}token_limit:${userId}:minute`);
    console.log(`  GET ${config.redis.keyPrefix}token_limit:${userId}:hour`);
    console.log(`  GET ${config.redis.keyPrefix}token_limit:${userId}:day`);
    console.log(`  `);
    console.log(`  # 모든 사용자 조회`);
    console.log(`  KEYS ${config.redis.keyPrefix}rate_limit:*`);
    console.log(`  KEYS ${config.redis.keyPrefix}token_limit:*`);
    console.log(`  `);
    console.log(`  # 카운터 리셋 (관리자용)`);
    console.log(`  DEL ${config.redis.keyPrefix}rate_limit:${userId}:minute`);
    console.log(`  DEL ${config.redis.keyPrefix}rate_limit:${userId}:hour`);
    console.log(`  DEL ${config.redis.keyPrefix}rate_limit:${userId}:day`);

    console.log("=".repeat(50));
  }

  /**
   * 사용자별 요청 패턴 분석
   */
  static async analyzeUserPattern(userId: string): Promise<void> {
    try {
      console.log(`\n📈 사용자 패턴 분석: ${userId}`);
      console.log("=".repeat(50));

      const requestStatus = await rateLimiter.getUserRequestStatus(userId);
      const tokenStatus = await rateLimiter.getUserTokenStatus(userId);

      // 사용률 계산
      const requestUsage = {
        minute:
          (requestStatus.minute.current / requestStatus.minute.limit) * 100,
        hour: (requestStatus.hour.current / requestStatus.hour.limit) * 100,
        day: (requestStatus.day.current / requestStatus.day.limit) * 100,
      };

      const tokenUsage = {
        minute: (tokenStatus.minute.current / tokenStatus.minute.limit) * 100,
        hour: (tokenStatus.hour.current / tokenStatus.hour.limit) * 100,
        day: (tokenStatus.day.current / tokenStatus.day.limit) * 100,
      };

      console.log("📊 요청 사용률:");
      console.log(
        `  분당: ${requestUsage.minute.toFixed(1)}% (${requestStatus.minute.current}/${requestStatus.minute.limit})`
      );
      console.log(
        `  시간당: ${requestUsage.hour.toFixed(1)}% (${requestStatus.hour.current}/${requestStatus.hour.limit})`
      );
      console.log(
        `  일당: ${requestUsage.day.toFixed(1)}% (${requestStatus.day.current}/${requestStatus.day.limit})`
      );

      console.log("\n🎯 토큰 사용률:");
      console.log(
        `  분당: ${tokenUsage.minute.toFixed(1)}% (${tokenStatus.minute.current}/${tokenStatus.minute.limit})`
      );
      console.log(
        `  시간당: ${tokenUsage.hour.toFixed(1)}% (${tokenStatus.hour.current}/${tokenStatus.hour.limit})`
      );
      console.log(
        `  일당: ${tokenUsage.day.toFixed(1)}% (${tokenStatus.day.current}/${tokenStatus.day.limit})`
      );

      // 경고 상태 체크
      const warnings = [];
      if (requestUsage.minute > 80) warnings.push("분당 요청 사용률 높음");
      if (requestUsage.hour > 80) warnings.push("시간당 요청 사용률 높음");
      if (requestUsage.day > 80) warnings.push("일당 요청 사용률 높음");
      if (tokenUsage.minute > 80) warnings.push("분당 토큰 사용률 높음");
      if (tokenUsage.hour > 80) warnings.push("시간당 토큰 사용률 높음");
      if (tokenUsage.day > 80) warnings.push("일당 토큰 사용률 높음");

      if (warnings.length > 0) {
        console.log("\n⚠️ 경고:");
        warnings.forEach((warning) => console.log(`  - ${warning}`));
      } else {
        console.log("\n✅ 정상 상태");
      }

      console.log("=".repeat(50));
    } catch (error) {
      console.error("사용자 패턴 분석 실패:", error);
    }
  }
}

// 사용 예시 함수들
export const adminUtils = {
  /**
   * 특정 사용자 현황 조회
   */
  async checkUser(userId: string) {
    await AdminLogger.getUserDetailedStatus(userId);
  },

  /**
   * 시스템 전체 현황 조회
   */
  async checkSystem() {
    await AdminLogger.getSystemStatus();
  },

  /**
   * Redis 카운터 조회 방법 안내
   */
  async showRedisCommands(userId: string) {
    await AdminLogger.getRedisCounters(userId);
  },

  /**
   * 사용자 패턴 분석
   */
  async analyzeUser(userId: string) {
    await AdminLogger.analyzeUserPattern(userId);
  },
};
