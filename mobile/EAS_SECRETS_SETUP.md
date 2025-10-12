# EAS Secrets 설정 가이드

Firebase 설정 파일과 같은 민감한 파일을 EAS Build에서 안전하게 사용하는 방법입니다.

## 🔐 설정된 EAS Secrets

현재 프로젝트에 다음 EAS 환경 변수가 설정되어 있습니다:

### 1. GOOGLE_SERVICES_JSON

- **타입**: File
- **플랫폼**: Android
- **용도**: Firebase Android 설정 파일
- **환경**: development, preview, production
- **경로**: EAS Build 시 자동으로 파일로 복원됨

### 2. GOOGLE_SERVICE_INFO_PLIST

- **타입**: File
- **플랫폼**: iOS
- **용도**: Firebase iOS 설정 파일
- **환경**: development, preview, production
- **경로**: EAS Build 시 자동으로 파일로 복원됨

## 📝 설정 방법

### Firebase 설정 파일 추가

```bash
# Android용 google-services.json 추가
eas env:create --name GOOGLE_SERVICES_JSON \
  --value ./google-services.json \
  --type file \
  --visibility secret \
  --environment production \
  --environment preview \
  --environment development

# iOS용 GoogleService-Info.plist 추가
eas env:create --name GOOGLE_SERVICE_INFO_PLIST \
  --value ./GoogleService-Info.plist \
  --type file \
  --visibility secret \
  --environment production \
  --environment preview \
  --environment development
```

### app.config.js 설정

Firebase 설정 파일을 EAS 환경 변수에서 읽도록 설정되어 있습니다:

```javascript
// iOS 설정
ios: {
  googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST || "./GoogleService-Info.plist",
  // ...
},

// Android 설정
android: {
  googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
  // ...
}
```

**동작 방식:**

- **EAS Build**: `process.env.GOOGLE_SERVICES_JSON`에서 파일을 읽어옴 (EAS가 자동으로 제공)
- **로컬 개발**: 로컬 파일 경로 (`./google-services.json`)를 사용

## 🔍 환경 변수 확인

### 모든 환경 변수 조회

```bash
eas env:list
```

### 특정 환경의 환경 변수 조회

```bash
# Development 환경
eas env:list --environment development

# Production 환경
eas env:list --environment production
```

## 🗑️ 환경 변수 삭제

더 이상 필요 없는 환경 변수를 삭제:

```bash
# 특정 환경에서 삭제
eas env:delete --name GOOGLE_SERVICES_JSON --environment development

# 모든 환경에서 삭제
eas env:delete --name GOOGLE_SERVICES_JSON
```

## 🔄 환경 변수 업데이트

기존 환경 변수를 업데이트:

```bash
eas env:update --name GOOGLE_SERVICES_JSON \
  --value ./google-services.json \
  --type file
```

## 📌 다른 민감한 데이터 추가

### API 키 추가

```bash
eas env:create --name OPENAI_API_KEY \
  --value "sk-..." \
  --type string \
  --visibility secret \
  --environment production
```

### 환경별 다른 값 설정

```bash
# Development 환경
eas env:create --name API_BASE_URL \
  --value "https://dev-api.example.com" \
  --environment development

# Production 환경
eas env:create --name API_BASE_URL \
  --value "https://api.example.com" \
  --environment production
```

## 🛡️ 보안 모범 사례

### 1. .gitignore 설정

민감한 파일이 Git에 커밋되지 않도록 설정:

```gitignore
# Firebase 구성 파일
GoogleService-Info.plist
google-services.json

# 환경 변수 파일
.env*.local
.env.prod

# EAS 빌드
credentials.json
service-account-*.json
```

### 2. Visibility 타입

- **plain**: 누구나 볼 수 있음 (민감하지 않은 데이터)
- **sensitive**: 프로젝트 멤버만 볼 수 있음 (약간 민감한 데이터)
- **secret**: 아무도 볼 수 없음, 빌드 시에만 사용 (매우 민감한 데이터) ✅ **권장**

### 3. 환경별 분리

- Development: 테스트용 키/파일
- Preview: 스테이징용 키/파일
- Production: 실제 프로덕션 키/파일

## ⚠️ 주의사항

1. **파일 크기 제한**: EAS 환경 변수로 저장할 수 있는 파일 크기에는 제한이 있습니다
2. **Base64 인코딩**: 파일은 자동으로 base64로 인코딩되어 저장됩니다
3. **Git 추적**: Firebase 설정 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
4. **로컬 개발**: 로컬에서는 여전히 실제 파일이 필요합니다

## 🔗 관련 문서

- [EAS 환경 변수 공식 문서](https://docs.expo.dev/eas/environment-variables/)
- [파일 환경 변수](https://docs.expo.dev/eas/environment-variables/#file-environment-variables)
- [Firebase 설정](https://docs.expo.dev/guides/using-firebase/)

## 📞 문제 해결

### 파일이 빌드에서 찾을 수 없음

```bash
# 환경 변수가 제대로 설정되었는지 확인
eas env:list

# 빌드 로그 확인
eas build:view <build-id>
```

### 로컬에서 파일을 찾을 수 없음

로컬 개발 시에는 실제 파일이 필요합니다:

```bash
# 파일이 올바른 위치에 있는지 확인
ls -la google-services.json
ls -la GoogleService-Info.plist
```

---

**업데이트:** 2025년 10월  
**버전:** 1.0.0
