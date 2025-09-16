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
};

// 환경 변수 검증 함수
export function validateConfig(): boolean {
  console.log("환경 변수 검증 중...");
  console.log("API Base URL:", config.apiBaseUrl);
  console.log("Environment:", config.environment);
  console.log("API Key 설정 여부:", !!config.openaiApiKey);

  if (!config.openaiApiKey) {
    console.error("❌ OPENAI_API_KEY가 설정되지 않았습니다.");
    console.error("💡 해결 방법:");
    console.error("   1. /mobile/ 디렉토리에 .env 파일을 생성하세요");
    console.error("   2. .env 파일에 다음 내용을 추가하세요:");
    console.error("      OPENAI_API_KEY=your_actual_openai_api_key_here");
    console.error("   3. 앱을 재시작하세요");
    return false;
  }

  if (config.openaiApiKey === "your_openai_api_key_here") {
    console.error("❌ OPENAI_API_KEY를 실제 값으로 변경해주세요.");
    console.error("💡 해결 방법:");
    console.error(
      "   1. .env 파일에서 OPENAI_API_KEY 값을 실제 OpenAI API 키로 변경하세요"
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

  console.log("✅ 환경 변수가 올바르게 설정되었습니다.");
  return true;
}

// 개발 환경에서만 환경 변수 출력 (보안상 주의)
export function logConfig(): void {
  if (config.environment === "development") {
    console.log("App Config:", {
      environment: config.environment,
      apiBaseUrl: config.apiBaseUrl,
      appName: config.appName,
      version: config.version,
      hasOpenaiKey: !!config.openaiApiKey,
    });
  }
}
