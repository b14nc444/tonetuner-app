import "dotenv/config";

const appConfig = {
  expo: {
    name: "ToneTuner",
    slug: "tonetuner-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      // 환경 변수들을 extra 객체에 추가
      openaiApiKey: process.env.OPENAI_API_KEY,
      environment: process.env.NODE_ENV || "development",
      apiBaseUrl: process.env.API_BASE_URL || "https://api.openai.com/v1",
    },
    // 보안을 위해 민감한 정보는 extra에만 포함
    // 이 값들은 앱에서 Constants.expoConfig.extra로 접근 가능
  },
};

export default appConfig;
