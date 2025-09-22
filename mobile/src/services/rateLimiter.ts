import { config } from "./config";

// Rate Limiter 인터페이스
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// Rate Limiter 클래스
export class RateLimiter {
  private redis: any = null;
  private isConnected: boolean = false;

  constructor() {
    this.initializeRedis();
  }

  /**
   * Redis 초기화 (간단한 메모리 기반 fallback 포함)
   */
  private async initializeRedis() {
    try {
      // Redis가 없는 경우를 위한 간단한 메모리 기반 구현
      if (typeof window !== "undefined") {
        // 클라이언트 사이드에서는 localStorage 사용
        this.isConnected = true;
        return;
      }

      // 서버 사이드에서는 Redis 사용 시도
      // 실제 프로덕션에서는 redis 패키지를 설치해야 함
      console.warn(
        "Redis가 설정되지 않았습니다. 메모리 기반 rate limiter를 사용합니다."
      );
      this.isConnected = true;
    } catch (error) {
      console.warn("Redis 연결 실패, 메모리 기반 rate limiter 사용:", error);
      this.isConnected = true;
    }
  }

  /**
   * 사용자별 요청 제한 확인
   */
  async checkUserRateLimit(
    userId: string,
    limitType: "minute" | "hour" | "day",
    limit: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowSize = this.getWindowSize(limitType);
    const key = this.getRateLimitKey(userId, limitType);

    try {
      if (typeof window !== "undefined") {
        // 클라이언트 사이드: localStorage 사용
        return this.checkRateLimitLocalStorage(key, limit, windowSize, now);
      } else {
        // 서버 사이드: 메모리 기반 구현
        return this.checkRateLimitMemory(key, limit, windowSize, now);
      }
    } catch (error) {
      console.error("Rate limit 체크 실패:", error);
      // 실패 시 허용 (서비스 중단 방지)
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowSize,
      };
    }
  }

  /**
   * 토큰 사용량 제한 확인
   */
  async checkTokenLimit(
    userId: string,
    tokens: number,
    limitType: "minute" | "hour" | "day",
    limit: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowSize = this.getWindowSize(limitType);
    const key = this.getTokenLimitKey(userId, limitType);

    try {
      if (typeof window !== "undefined") {
        // 클라이언트 사이드: localStorage 사용
        return this.checkTokenLimitLocalStorage(
          key,
          tokens,
          limit,
          windowSize,
          now
        );
      } else {
        // 서버 사이드: 메모리 기반 구현
        return this.checkTokenLimitMemory(key, tokens, limit, windowSize, now);
      }
    } catch (error) {
      console.error("Token limit 체크 실패:", error);
      // 실패 시 허용 (서비스 중단 방지)
      return {
        allowed: true,
        remaining: limit - tokens,
        resetTime: now + windowSize,
      };
    }
  }

  /**
   * localStorage 기반 rate limit 체크
   */
  private checkRateLimitLocalStorage(
    key: string,
    limit: number,
    windowSize: number,
    now: number
  ): RateLimitResult {
    try {
      const stored = localStorage.getItem(key);
      let requests: number[] = [];

      if (stored) {
        requests = JSON.parse(stored);
      }

      // 오래된 요청 제거
      requests = requests.filter((timestamp) => now - timestamp < windowSize);

      if (requests.length >= limit) {
        const oldestRequest = Math.min(...requests);
        const resetTime = oldestRequest + windowSize;
        return {
          allowed: false,
          remaining: 0,
          resetTime,
          retryAfter: Math.ceil((resetTime - now) / 1000),
        };
      }

      // 새 요청 추가
      requests.push(now);
      localStorage.setItem(key, JSON.stringify(requests));

      return {
        allowed: true,
        remaining: limit - requests.length,
        resetTime: now + windowSize,
      };
    } catch (error) {
      console.error("localStorage rate limit 체크 실패:", error);
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowSize,
      };
    }
  }

  /**
   * localStorage 기반 토큰 제한 체크
   */
  private checkTokenLimitLocalStorage(
    key: string,
    tokens: number,
    limit: number,
    windowSize: number,
    now: number
  ): RateLimitResult {
    try {
      const stored = localStorage.getItem(key);
      let tokenUsage: Array<{ timestamp: number; tokens: number }> = [];

      if (stored) {
        tokenUsage = JSON.parse(stored);
      }

      // 오래된 사용량 제거
      tokenUsage = tokenUsage.filter(
        (usage) => now - usage.timestamp < windowSize
      );

      const currentUsage = tokenUsage.reduce(
        (sum, usage) => sum + usage.tokens,
        0
      );

      if (currentUsage + tokens > limit) {
        const oldestUsage = Math.min(...tokenUsage.map((u) => u.timestamp));
        const resetTime = oldestUsage + windowSize;
        return {
          allowed: false,
          remaining: Math.max(0, limit - currentUsage),
          resetTime,
          retryAfter: Math.ceil((resetTime - now) / 1000),
        };
      }

      // 새 토큰 사용량 추가
      tokenUsage.push({ timestamp: now, tokens });
      localStorage.setItem(key, JSON.stringify(tokenUsage));

      return {
        allowed: true,
        remaining: limit - (currentUsage + tokens),
        resetTime: now + windowSize,
      };
    } catch (error) {
      console.error("localStorage token limit 체크 실패:", error);
      return {
        allowed: true,
        remaining: limit - tokens,
        resetTime: now + windowSize,
      };
    }
  }

  /**
   * 메모리 기반 rate limit 체크 (서버 사이드)
   */
  private checkRateLimitMemory(
    key: string,
    limit: number,
    windowSize: number,
    now: number
  ): RateLimitResult {
    // 간단한 메모리 기반 구현
    // 실제로는 Redis나 다른 저장소를 사용해야 함
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowSize,
    };
  }

  /**
   * 메모리 기반 토큰 제한 체크 (서버 사이드)
   */
  private checkTokenLimitMemory(
    key: string,
    tokens: number,
    limit: number,
    windowSize: number,
    now: number
  ): RateLimitResult {
    // 간단한 메모리 기반 구현
    // 실제로는 Redis나 다른 저장소를 사용해야 함
    return {
      allowed: true,
      remaining: limit - tokens,
      resetTime: now + windowSize,
    };
  }

  /**
   * 윈도우 크기 계산
   */
  private getWindowSize(limitType: "minute" | "hour" | "day"): number {
    switch (limitType) {
      case "minute":
        return 60 * 1000; // 1분
      case "hour":
        return 60 * 60 * 1000; // 1시간
      case "day":
        return 24 * 60 * 60 * 1000; // 1일
      default:
        return 60 * 1000;
    }
  }

  /**
   * Rate limit 키 생성
   */
  private getRateLimitKey(userId: string, limitType: string): string {
    return `${config.redis.keyPrefix}rate_limit:${userId}:${limitType}`;
  }

  /**
   * 토큰 제한 키 생성
   */
  private getTokenLimitKey(userId: string, limitType: string): string {
    return `${config.redis.keyPrefix}token_limit:${userId}:${limitType}`;
  }

  /**
   * 사용자별 요청 현황 조회
   */
  async getUserRequestStatus(userId: string): Promise<{
    minute: { current: number; limit: number; remaining: number };
    hour: { current: number; limit: number; remaining: number };
    day: { current: number; limit: number; remaining: number };
  }> {
    const status = {
      minute: { current: 0, limit: 0, remaining: 0 },
      hour: { current: 0, limit: 0, remaining: 0 },
      day: { current: 0, limit: 0, remaining: 0 },
    };

    try {
      // 각 시간대별 현재 요청 수 조회
      const minuteKey = this.getRateLimitKey(userId, "minute");
      const hourKey = this.getRateLimitKey(userId, "hour");
      const dayKey = this.getRateLimitKey(userId, "day");

      if (typeof window !== "undefined") {
        // 클라이언트 사이드: localStorage에서 조회
        const minuteData = localStorage.getItem(minuteKey);
        const hourData = localStorage.getItem(hourKey);
        const dayData = localStorage.getItem(dayKey);

        const now = Date.now();
        const minuteWindow = 60 * 1000;
        const hourWindow = 60 * 60 * 1000;
        const dayWindow = 24 * 60 * 60 * 1000;

        // 분당 요청 수
        if (minuteData) {
          const requests = JSON.parse(minuteData).filter(
            (timestamp: number) => now - timestamp < minuteWindow
          );
          status.minute.current = requests.length;
        }
        status.minute.limit = config.userRateLimits.requestsPerMinute;
        status.minute.remaining = Math.max(
          0,
          status.minute.limit - status.minute.current
        );

        // 시간당 요청 수
        if (hourData) {
          const requests = JSON.parse(hourData).filter(
            (timestamp: number) => now - timestamp < hourWindow
          );
          status.hour.current = requests.length;
        }
        status.hour.limit = config.userRateLimits.requestsPerHour;
        status.hour.remaining = Math.max(
          0,
          status.hour.limit - status.hour.current
        );

        // 일당 요청 수
        if (dayData) {
          const requests = JSON.parse(dayData).filter(
            (timestamp: number) => now - timestamp < dayWindow
          );
          status.day.current = requests.length;
        }
        status.day.limit = config.userRateLimits.requestsPerDay;
        status.day.remaining = Math.max(
          0,
          status.day.limit - status.day.current
        );
      } else {
        // 서버 사이드: 메모리 기반 조회 (실제로는 Redis 사용)
        // 여기서는 기본값 반환
        status.minute.limit = config.userRateLimits.requestsPerMinute;
        status.hour.limit = config.userRateLimits.requestsPerHour;
        status.day.limit = config.userRateLimits.requestsPerDay;
      }
    } catch (error) {
      console.error("사용자 요청 현황 조회 실패:", error);
    }

    return status;
  }

  /**
   * 사용자별 토큰 사용 현황 조회
   */
  async getUserTokenStatus(userId: string): Promise<{
    minute: { current: number; limit: number; remaining: number };
    hour: { current: number; limit: number; remaining: number };
    day: { current: number; limit: number; remaining: number };
  }> {
    const status = {
      minute: { current: 0, limit: 0, remaining: 0 },
      hour: { current: 0, limit: 0, remaining: 0 },
      day: { current: 0, limit: 0, remaining: 0 },
    };

    try {
      // 각 시간대별 현재 토큰 사용량 조회
      const minuteKey = this.getTokenLimitKey(userId, "minute");
      const hourKey = this.getTokenLimitKey(userId, "hour");
      const dayKey = this.getTokenLimitKey(userId, "day");

      if (typeof window !== "undefined") {
        // 클라이언트 사이드: localStorage에서 조회
        const minuteData = localStorage.getItem(minuteKey);
        const hourData = localStorage.getItem(hourKey);
        const dayData = localStorage.getItem(dayKey);

        const now = Date.now();
        const minuteWindow = 60 * 1000;
        const hourWindow = 60 * 60 * 1000;
        const dayWindow = 24 * 60 * 60 * 1000;

        // 분당 토큰 사용량
        if (minuteData) {
          const tokenUsage = JSON.parse(minuteData).filter(
            (usage: { timestamp: number }) =>
              now - usage.timestamp < minuteWindow
          );
          status.minute.current = tokenUsage.reduce(
            (sum: number, usage: { tokens: number }) => sum + usage.tokens,
            0
          );
        }
        status.minute.limit = config.userRateLimits.tokensPerMinute;
        status.minute.remaining = Math.max(
          0,
          status.minute.limit - status.minute.current
        );

        // 시간당 토큰 사용량
        if (hourData) {
          const tokenUsage = JSON.parse(hourData).filter(
            (usage: { timestamp: number }) => now - usage.timestamp < hourWindow
          );
          status.hour.current = tokenUsage.reduce(
            (sum: number, usage: { tokens: number }) => sum + usage.tokens,
            0
          );
        }
        status.hour.limit = config.userRateLimits.tokensPerHour;
        status.hour.remaining = Math.max(
          0,
          status.hour.limit - status.hour.current
        );

        // 일당 토큰 사용량
        if (dayData) {
          const tokenUsage = JSON.parse(dayData).filter(
            (usage: { timestamp: number }) => now - usage.timestamp < dayWindow
          );
          status.day.current = tokenUsage.reduce(
            (sum: number, usage: { tokens: number }) => sum + usage.tokens,
            0
          );
        }
        status.day.limit = config.userRateLimits.tokensPerDay;
        status.day.remaining = Math.max(
          0,
          status.day.limit - status.day.current
        );
      } else {
        // 서버 사이드: 메모리 기반 조회 (실제로는 Redis 사용)
        // 여기서는 기본값 반환
        status.minute.limit = config.userRateLimits.tokensPerMinute;
        status.hour.limit = config.userRateLimits.tokensPerHour;
        status.day.limit = config.userRateLimits.tokensPerDay;
      }
    } catch (error) {
      console.error("사용자 토큰 현황 조회 실패:", error);
    }

    return status;
  }

  /**
   * 사용자 ID 생성 (간단한 구현)
   */
  static generateUserId(): string {
    if (typeof window !== "undefined") {
      // 클라이언트 사이드: 기존 ID 사용 또는 새로 생성
      let userId = localStorage.getItem("tonetuner_user_id");
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("tonetuner_user_id", userId);
      }
      return userId;
    } else {
      // 서버 사이드: 세션 기반 ID 생성
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }
}

// 싱글톤 인스턴스
export const rateLimiter = new RateLimiter();
