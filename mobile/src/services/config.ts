import Constants from "expo-constants";

// 환경 변수에 안전하게 접근하는 설정 파일
export const config = {
  // OpenAI API 키
  openaiApiKey: Constants.expoConfig?.extra?.openaiApiKey as string,

  // 환경 설정
  environment:
    (Constants.expoConfig?.extra?.environment as string) || "development",

  // API 기본 URL
  apiBaseUrl:
    (Constants.expoConfig?.extra?.apiBaseUrl as string) ||
    "https://api.openai.com/v1",

  // 앱 정보
  appName: Constants.expoConfig?.name || "ToneTuner",
  version: Constants.expoConfig?.version || "1.0.0",

  // 환경별 추가 설정
  debug: (Constants.expoConfig?.extra?.debug as boolean) || false,
  logLevel: (Constants.expoConfig?.extra?.logLevel as string) || "info",
  apiTimeout: (Constants.expoConfig?.extra?.apiTimeout as number) || 30000,
  enableLogging:
    (Constants.expoConfig?.extra?.enableLogging as boolean) || false,
  enableDebugMode:
    (Constants.expoConfig?.extra?.enableDebugMode as boolean) || false,

  // 비용 보호 설정
  maxTokensPerRequest:
    (Constants.expoConfig?.extra?.maxTokensPerRequest as number) || 1000,
  maxRequestsPerMinute:
    (Constants.expoConfig?.extra?.maxRequestsPerMinute as number) || 10,
  maxRequestsPerHour:
    (Constants.expoConfig?.extra?.maxRequestsPerHour as number) || 50,
  maxRequestsPerDay:
    (Constants.expoConfig?.extra?.maxRequestsPerDay as number) || 1000,
  enableRateLimit:
    (Constants.expoConfig?.extra?.enableRateLimit as boolean) || true,
  enableCostMonitoring:
    (Constants.expoConfig?.extra?.enableCostMonitoring as boolean) || true,
  costAlertThreshold:
    (Constants.expoConfig?.extra?.costAlertThreshold as number) || 10.0,
  dailyCostLimit:
    (Constants.expoConfig?.extra?.dailyCostLimit as number) || 50.0,
  monthlyCostLimit:
    (Constants.expoConfig?.extra?.monthlyCostLimit as number) || 500.0,

  // Redis 설정
  redis: {
    host: (Constants.expoConfig?.extra?.redisHost as string) || "localhost",
    port: (Constants.expoConfig?.extra?.redisPort as number) || 6379,
    password: (Constants.expoConfig?.extra?.redisPassword as string) || "",
    db: (Constants.expoConfig?.extra?.redisDb as number) || 0,
    keyPrefix:
      (Constants.expoConfig?.extra?.redisKeyPrefix as string) || "tonetuner:",
  },

  // 사용자별 레이트 리미트 설정
  userRateLimits: {
    requestsPerMinute:
      (Constants.expoConfig?.extra?.userRequestsPerMinute as number) || 5,
    requestsPerHour:
      (Constants.expoConfig?.extra?.userRequestsPerHour as number) || 50,
    requestsPerDay:
      (Constants.expoConfig?.extra?.userRequestsPerDay as number) || 200,
    tokensPerMinute:
      (Constants.expoConfig?.extra?.userTokensPerMinute as number) || 5000,
    tokensPerHour:
      (Constants.expoConfig?.extra?.userTokensPerHour as number) || 50000,
    tokensPerDay:
      (Constants.expoConfig?.extra?.userTokensPerDay as number) || 200000,
  },
};

// 환경 변수 검증 함수
export function validateConfig(): boolean {
  const isDevelopment = config.environment === "development";

  // 개발 환경에서만 로그 출력
  if (isDevelopment && config.enableLogging) {
    console.log("🔍 환경 변수 검증 중...");
    console.log("Environment:", config.environment);
    console.log("API Base URL:", config.apiBaseUrl);
    console.log("API Key 설정 여부:", !!config.openaiApiKey);
    console.log("Debug Mode:", config.debug);
    console.log("Log Level:", config.logLevel);
  }

  // API 키 검증
  if (!config.openaiApiKey) {
    console.error("❌ OPENAI_API_KEY가 설정되지 않았습니다.");
    console.error("💡 해결 방법:");
    console.error(
      `   1. /mobile/ 디렉토리에 .env.${config.environment} 파일을 확인하세요`
    );
    console.error("   2. .env 파일에 다음 내용을 추가하세요:");
    console.error("      OPENAI_API_KEY=your_actual_openai_api_key_here");
    console.error("   3. 앱을 재시작하세요");
    return false;
  }

  if (config.openaiApiKey === "your_openai_api_key_here") {
    console.error("❌ OPENAI_API_KEY를 실제 값으로 변경해주세요.");
    console.error("💡 해결 방법:");
    console.error(
      `   1. .env.${config.environment} 파일에서 OPENAI_API_KEY 값을 실제 OpenAI API 키로 변경하세요`
    );
    console.error(
      "   2. OpenAI API 키는 https://platform.openai.com/api-keys 에서 발급받을 수 있습니다"
    );
    return false;
  }

  if (config.openaiApiKey.length < 20) {
    console.error(
      "❌ OPENAI_API_KEY가 너무 짧습니다. 올바른 API 키인지 확인해주세요."
    );
    return false;
  }

  // 환경별 설정 검증
  if (config.enableCostMonitoring) {
    if (config.dailyCostLimit <= 0 || config.monthlyCostLimit <= 0) {
      console.warn(
        "⚠️ 비용 모니터링이 활성화되었지만 일일/월간 비용 한도가 설정되지 않았습니다."
      );
    }
  }

  // Rate limiting 설정 검증
  if (config.enableRateLimit) {
    const limits = config.userRateLimits;
    if (
      limits.requestsPerMinute <= 0 ||
      limits.requestsPerHour <= 0 ||
      limits.requestsPerDay <= 0
    ) {
      console.warn(
        "⚠️ Rate limiting이 활성화되었지만 요청 제한이 올바르게 설정되지 않았습니다."
      );
    }
  }

  // 개발 환경에서만 성공 로그 출력
  if (isDevelopment && config.enableLogging) {
    console.log("✅ 환경 변수가 올바르게 설정되었습니다.");
    console.log("📊 현재 설정:");
    console.log(`   - 환경: ${config.environment}`);
    console.log(`   - 디버그 모드: ${config.debug}`);
    console.log(`   - 로깅 활성화: ${config.enableLogging}`);
    console.log(`   - 비용 모니터링: ${config.enableCostMonitoring}`);
  }

  return true;
}

// 개발 환경에서만 환경 변수 출력 (보안상 주의)
export function logConfig(): void {
  if (config.environment === "development" && config.enableLogging) {
    console.log("📱 App Config:", {
      environment: config.environment,
      apiBaseUrl: config.apiBaseUrl,
      appName: config.appName,
      version: config.version,
      hasOpenaiKey: !!config.openaiApiKey,
      debug: config.debug,
      logLevel: config.logLevel,
      enableCostMonitoring: config.enableCostMonitoring,
    });
  }
}

// 환경별 설정 정보 반환
export function getEnvironmentInfo() {
  return {
    environment: config.environment,
    isDevelopment: config.environment === "development",
    isProduction: config.environment === "production",
    debug: config.debug,
    enableLogging: config.enableLogging,
    enableCostMonitoring: config.enableCostMonitoring,
  };
}
