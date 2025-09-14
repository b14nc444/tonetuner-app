# 환경 변수 설정 가이드

이 가이드는 ToneTuner 앱에서 환경 변수를 안전하게 설정하고 사용하는 방법을 설명합니다.

## 1. .env 파일 생성

프로젝트 루트 디렉토리(`/mobile/`)에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# OpenAI API 설정
OPENAI_API_KEY=your_actual_openai_api_key_here

# 환경 설정
NODE_ENV=development

# API 기본 URL (선택사항)
API_BASE_URL=https://api.openai.com/v1
```

## 2. 환경 변수 사용 방법

### 설정 파일에서 접근

```typescript
import { config, validateConfig, logConfig } from "./src/services/config";

// 환경 변수 검증
if (validateConfig()) {
  console.log("환경 변수가 올바르게 설정되었습니다.");
}

// 개발 환경에서 설정 로그 출력
logConfig();

// API 키 사용
const apiKey = config.openaiApiKey;
```

### 컴포넌트에서 직접 접근

```typescript
import Constants from "expo-constants";

// 환경 변수에 접근
const openaiApiKey = Constants.expoConfig?.extra?.openaiApiKey;
const environment = Constants.expoConfig?.extra?.environment;
```

## 3. 보안 주의사항

### ✅ 안전한 방법

- `.env` 파일을 `.gitignore`에 추가하여 Git에 커밋하지 않음
- `app.config.js`의 `extra` 객체에만 민감한 정보 저장
- 프로덕션에서는 환경 변수를 서버에서 설정

### ❌ 피해야 할 방법

- `EXPO_PUBLIC_` 접두사로 환경 변수 노출 (클라이언트에서 접근 가능)
- 하드코딩된 API 키
- Git에 커밋되는 `.env` 파일

## 4. 환경별 설정

### 개발 환경

```bash
NODE_ENV=development
OPENAI_API_KEY=your_dev_api_key
```

### 프로덕션 환경

```bash
NODE_ENV=production
OPENAI_API_KEY=your_prod_api_key
```

## 5. Expo 빌드 시 환경 변수 설정

### EAS Build 사용 시

```bash
# eas.json에서 환경 변수 설정
{
  "build": {
    "production": {
      "env": {
        "OPENAI_API_KEY": "your_production_api_key"
      }
    }
  }
}
```

### 로컬 빌드 시

```bash
# 빌드 전에 환경 변수 설정
export OPENAI_API_KEY=your_api_key
expo build
```

## 6. 문제 해결

### 환경 변수가 로드되지 않는 경우

1. `.env` 파일이 올바른 위치에 있는지 확인
2. `app.config.js`에서 `import 'dotenv/config';`가 있는지 확인
3. 앱을 재시작했는지 확인

### API 키가 유효하지 않은 경우

1. OpenAI API 키가 올바른지 확인
2. API 키에 충분한 크레딧이 있는지 확인
3. API 키 권한이 올바른지 확인

## 7. 예시 파일들

### .env.example (템플릿)

```bash
# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here

# 환경 설정
NODE_ENV=development

# API 기본 URL (선택사항)
API_BASE_URL=https://api.openai.com/v1
```

### app.config.js

```javascript
import "dotenv/config";

export default {
  expo: {
    // ... 기타 설정
    extra: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      environment: process.env.NODE_ENV || "development",
      apiBaseUrl: process.env.API_BASE_URL || "https://api.openai.com/v1",
    },
  },
};
```

이제 환경 변수를 안전하게 관리할 수 있습니다! 🎉
