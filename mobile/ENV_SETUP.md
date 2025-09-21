# 환경변수 설정 가이드

이 프로젝트는 개발 환경과 프로덕션 환경에 따라 다른 환경변수를 사용합니다.

## 환경변수 파일 구조

```
mobile/
├── .env.dev      # 개발 환경 변수
├── .env.prod     # 프로덕션 환경 변수
└── app.config.js # 환경별 설정 로딩
```

## 사용법

### 1. 개발 환경으로 실행

```bash
# 개발 환경으로 앱 시작
npm run start:dev

# 개발 환경으로 Android 실행
npm run android:dev

# 개발 환경으로 iOS 실행
npm run ios:dev

# 개발 환경으로 웹 실행
npm run web:start:dev
```

### 2. 프로덕션 환경으로 실행

```bash
# 프로덕션 환경으로 앱 시작
npm run start:prod

# 프로덕션 환경으로 Android 실행
npm run android:prod

# 프로덕션 환경으로 iOS 실행
npm run ios:prod

# 프로덕션 환경으로 웹 실행
npm run web:start:prod
```

### 3. 빌드

```bash
# 개발 환경 빌드
npm run build:dev

# 프로덕션 환경 빌드
npm run build:prod

# 웹 빌드 (개발)
npm run web:build:dev

# 웹 빌드 (프로덕션)
npm run web:build:prod
```

## 환경변수 설정

### 개발 환경 (.env.dev)

```env
# 개발 환경 변수 설정
NODE_ENV=development
OPENAI_API_KEY=your_development_api_key_here
API_BASE_URL=https://api.openai.com/v1
ENVIRONMENT=development

# 개발 환경 전용 설정
DEBUG=true
LOG_LEVEL=debug
API_TIMEOUT=30000
ENABLE_LOGGING=true
ENABLE_DEBUG_MODE=true

# 비용 보호 설정
MAX_TOKENS_PER_REQUEST=1000
MAX_REQUESTS_PER_MINUTE=10
MAX_REQUESTS_PER_HOUR=100
MAX_REQUESTS_PER_DAY=1000
ENABLE_RATE_LIMIT=true
ENABLE_COST_MONITORING=true
COST_ALERT_THRESHOLD=10.0
DAILY_COST_LIMIT=50.0
MONTHLY_COST_LIMIT=500.0
```

### 프로덕션 환경 (.env.prod)

```env
# 프로덕션 환경 변수 설정
NODE_ENV=production
OPENAI_API_KEY=your_production_api_key_here
API_BASE_URL=https://api.openai.com/v1
ENVIRONMENT=production

# 프로덕션 환경 전용 설정
DEBUG=false
LOG_LEVEL=error
API_TIMEOUT=15000
ENABLE_LOGGING=false
ENABLE_DEBUG_MODE=false

# 비용 보호 설정
MAX_TOKENS_PER_REQUEST=1000
MAX_REQUESTS_PER_MINUTE=10
MAX_REQUESTS_PER_HOUR=100
MAX_REQUESTS_PER_DAY=1000
ENABLE_RATE_LIMIT=true
ENABLE_COST_MONITORING=true
COST_ALERT_THRESHOLD=10.0
DAILY_COST_LIMIT=50.0
MONTHLY_COST_LIMIT=500.0
```

## 환경변수 설명

### 기본 설정

- `NODE_ENV`: Node.js 환경 (development/production)
- `OPENAI_API_KEY`: OpenAI API 키
- `API_BASE_URL`: API 기본 URL
- `ENVIRONMENT`: 앱 환경 (development/production)

### 디버그 설정

- `DEBUG`: 디버그 모드 활성화 여부
- `LOG_LEVEL`: 로그 레벨 (debug/info/warn/error)
- `API_TIMEOUT`: API 요청 타임아웃 (밀리초)
- `ENABLE_LOGGING`: 로깅 활성화 여부
- `ENABLE_DEBUG_MODE`: 디버그 모드 활성화 여부

### 비용 보호 설정

- `MAX_TOKENS_PER_REQUEST`: 요청당 최대 토큰 수
- `MAX_REQUESTS_PER_MINUTE`: 분당 최대 요청 수
- `MAX_REQUESTS_PER_HOUR`: 시간당 최대 요청 수
- `MAX_REQUESTS_PER_DAY`: 일일 최대 요청 수
- `ENABLE_RATE_LIMIT`: 요청 제한 활성화 여부
- `ENABLE_COST_MONITORING`: 비용 모니터링 활성화 여부
- `COST_ALERT_THRESHOLD`: 비용 알림 임계값
- `DAILY_COST_LIMIT`: 일일 비용 한도
- `MONTHLY_COST_LIMIT`: 월간 비용 한도

## 코드에서 환경변수 사용

```typescript
import { config, validateConfig, getEnvironmentInfo } from "./services/config";

// 환경변수 검증
if (!validateConfig()) {
  console.error("환경변수 설정에 문제가 있습니다.");
}

// 환경 정보 확인
const envInfo = getEnvironmentInfo();
console.log("현재 환경:", envInfo.environment);
console.log("디버그 모드:", envInfo.debug);

// 설정값 사용
const apiKey = config.openaiApiKey;
const isDebug = config.debug;
const logLevel = config.logLevel;
```

## 개발 환경 표시기

개발 환경에서는 화면 우상단에 빨간색 "🔧 DEV" 표시기가 나타납니다. 이 표시기는:

- **개발 환경에서만 표시**: 프로덕션 환경에서는 표시되지 않습니다
- **시각적 구분**: 개발 중인 버전임을 명확히 알 수 있습니다
- **애니메이션 효과**: 펄스 애니메이션으로 주의를 끕니다
- **호버 효과**: 마우스를 올리면 확대되고 그림자가 강해집니다

## 주의사항

1. **보안**: `.env` 파일들은 Git에 커밋하지 마세요. `.gitignore`에 추가되어 있습니다.
2. **API 키**: 개발용과 프로덕션용 API 키를 다르게 사용하는 것을 권장합니다.
3. **비용 모니터링**: 프로덕션 환경에서는 비용 모니터링을 활성화하여 예상치 못한 비용을 방지하세요.
4. **로그 레벨**: 프로덕션 환경에서는 로그 레벨을 `error`로 설정하여 성능을 최적화하세요.
5. **개발 환경 표시기**: 프로덕션 배포 전에 개발 환경 표시기가 사라지는지 확인하세요.

## 문제 해결

### 환경변수가 로드되지 않는 경우

1. `.env.dev` 또는 `.env.prod` 파일이 올바른 위치에 있는지 확인
2. 파일명이 정확한지 확인 (대소문자 구분)
3. 앱을 재시작

### API 키 오류

1. API 키가 올바른지 확인
2. API 키가 해당 환경 파일에 올바르게 설정되었는지 확인
3. API 키의 권한이 올바른지 확인

### 빌드 오류

1. 환경변수 파일이 존재하는지 확인
2. 필수 환경변수가 모두 설정되었는지 확인
3. `NODE_ENV` 환경변수가 올바르게 설정되었는지 확인
