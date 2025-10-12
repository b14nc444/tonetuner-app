// 환경에 따라 다른 .env 파일 로드
const environment = process.env.NODE_ENV || "development";
const envFile = environment === "production" ? ".env.prod" : ".env.dev";

// dotenv 설정
require("dotenv").config({ path: envFile });

const appConfig = {
    expo: {
        // 앱 기본 정보
        name: "ToneTuner",
        slug: "tonetuner-app",
        version: "1.0.0",
        description: "AI 기반 톤 조정 앱으로 텍스트의 톤을 원하는 스타일로 변환해보세요.",
        orientation: "portrait",
        icon: "./assets/icon.png",
        newArchEnabled: true,

        // 스플래시 스크린 설정
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },

        // iOS 설정
        ios: {
            bundleIdentifier: "com.tonetuner.app",
            buildNumber: "1",
            supportsTablet: true,
            requireFullScreen: false,
            associatedDomains: ["applinks:tonetuner.app"],
        },

        // Android 설정
        android: {
            package: "com.tonetuner.app",
            versionCode: 1,
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            permissions: [
                "android.permission.INTERNET",
                "android.permission.ACCESS_NETWORK_STATE",
            ],
            intentFilters: [{
                action: "VIEW",
                data: [{
                    scheme: "https",
                    host: "tonetuner.app",
                }, ],
                category: ["BROWSABLE", "DEFAULT"],
            }, ],
        },

        // 웹 설정
        web: {
            favicon: "./assets/favicon.png",
            bundler: "metro",
            //   output: "static",
        },

        // 2. 빌드 설정 최적화
        build: {
            development: {
                developmentClient: true,
                distribution: "internal",
            },
            preview: {
                distribution: "internal",
                android: {
                    buildType: "apk",
                },
            },
            production: {
                android: {
                    buildType: "aab",
                },
            },
        },

        // 업데이트 설정
        updates: {
            url: "https://u.expo.dev/your-project-id",
            fallbackToCacheTimeout: 0,
        },

        // 런타임 버전
        runtimeVersion: {
            policy: "appVersion",
        },

        // 환경 변수 설정
        extra: {
            openaiApiKey: process.env.OPENAI_API_KEY,
            environment: process.env.ENVIRONMENT || process.env.NODE_ENV || "development",
            apiBaseUrl: process.env.API_BASE_URL || "https://api.openai.com/v1",

            // 환경별 추가 설정
            debug: process.env.DEBUG === "true",
            logLevel: process.env.LOG_LEVEL || "info",
            apiTimeout: parseInt(process.env.API_TIMEOUT) || 30000,
            enableLogging: process.env.ENABLE_LOGGING === "true",
            enableDebugMode: process.env.ENABLE_DEBUG_MODE === "true",

            // 비용 보호 설정
            maxTokensPerRequest: parseInt(process.env.MAX_TOKENS_PER_REQUEST) || 1000,
            maxRequestsPerMinute: parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 10,
            maxRequestsPerHour: parseInt(process.env.MAX_REQUESTS_PER_HOUR) || 100,
            maxRequestsPerDay: parseInt(process.env.MAX_REQUESTS_PER_DAY) || 1000,
            enableRateLimit: process.env.ENABLE_RATE_LIMIT === "true",
            enableCostMonitoring: process.env.ENABLE_COST_MONITORING === "true",
            costAlertThreshold: parseFloat(process.env.COST_ALERT_THRESHOLD) || 10.0,
            dailyCostLimit: parseFloat(process.env.DAILY_COST_LIMIT) || 50.0,
            monthlyCostLimit: parseFloat(process.env.MONTHLY_COST_LIMIT) || 500.0,

            // EAS 프로젝트 설정
            eas: {
                projectId: "your-project-id-here", // EAS 프로젝트 ID로 교체 필요
            },
        },

        // 3. 스토어 배포용 메타데이터
        appStore: {
            title: "ToneTuner - AI 톤 조정",
            subtitle: "텍스트의 톤을 원하는 스타일로 변환",
            description: "ToneTuner는 AI 기술을 활용하여 텍스트의 톤을 다양한 스타일로 변환해주는 혁신적인 앱입니다. 공식적인 톤, 친근한 톤, 전문적인 톤 등 원하는 톤으로 텍스트를 재작성할 수 있습니다.",
            keywords: ["AI", "텍스트", "톤", "작문", "번역", "언어", "생산성"],
            category: "PRODUCTIVITY",
            contentRating: "4+",
        },

        // Google Play Store 메타데이터
        playStore: {
            title: "ToneTuner - AI 톤 조정",
            shortDescription: "AI로 텍스트 톤을 원하는 스타일로 변환",
            fullDescription: "ToneTuner는 AI 기술을 활용하여 텍스트의 톤을 다양한 스타일로 변환해주는 혁신적인 앱입니다. 공식적인 톤, 친근한 톤, 전문적인 톤 등 원하는 톤으로 텍스트를 재작성할 수 있습니다. 작문, 이메일, 소셜미디어 포스트 등 다양한 상황에서 활용하세요.",
            category: "PRODUCTIVITY",
            contentRating: "EVERYONE",
        },
    },
};

export default appConfig;