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
  if (!config.openaiApiKey) {
    console.error("OPENAI_API_KEY가 설정되지 않았습니다.");
    return false;
  }

  if (config.openaiApiKey === "your_openai_api_key_here") {
    console.error("OPENAI_API_KEY를 실제 값으로 변경해주세요.");
    return false;
  }

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
