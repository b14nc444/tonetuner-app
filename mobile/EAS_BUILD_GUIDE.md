# EAS 빌드 가이드

ToneTuner 앱을 Expo Application Services (EAS)를 사용하여 빌드하고 배포하는 방법을 안내합니다.

## 📋 목차

- [사전 준비](#사전-준비)
- [EAS CLI 설치 및 로그인](#eas-cli-설치-및-로그인)
- [프로젝트 설정](#프로젝트-설정)
- [빌드 실행](#빌드-실행)
- [앱 스토어 제출](#앱-스토어-제출)
- [OTA 업데이트](#ota-업데이트)
- [문제 해결](#문제-해결)

---

## 🔧 사전 준비

### 1. 필수 계정 준비

#### Expo 계정

- [Expo.dev](https://expo.dev/) 가입
- EAS Build 사용을 위한 프로젝트 생성

#### iOS 빌드를 위한 Apple Developer 계정

- [Apple Developer Program](https://developer.apple.com/) 가입 ($99/년)
- App ID, Bundle Identifier 설정
- Certificates 및 Provisioning Profiles

#### Android 빌드를 위한 Google Play Console

- [Google Play Console](https://play.google.com/console) 가입 ($25 일회성)
- 앱 등록
- Service Account 생성 (자동 제출용)

### 2. 환경 파일 준비

프로젝트 루트에 환경 파일 생성:

```bash
# .env.dev (개발용)
NODE_ENV=development
OPENAI_API_KEY=your-dev-api-key
ADMOB_ANDROID_APP_ID=ca-app-pub-3940256099942544~3347511713
ADMOB_IOS_APP_ID=ca-app-pub-3940256099942544~1458002511
# ... 기타 환경 변수

# .env.prod (프로덕션용)
NODE_ENV=production
OPENAI_API_KEY=your-prod-api-key
ADMOB_ANDROID_APP_ID=your-real-android-app-id
ADMOB_IOS_APP_ID=your-real-ios-app-id
# ... 기타 환경 변수
```

### 3. Firebase 설정

```bash
# iOS용 Firebase 설정 파일
mobile/GoogleService-Info.plist

# Android용 Firebase 설정 파일
mobile/google-services.json
```

---

## 📦 EAS CLI 설치 및 로그인

### 1. EAS CLI 전역 설치

```bash
npm install -g eas-cli
```

### 2. Expo 계정으로 로그인

```bash
eas login
```

또는 이미 expo 계정이 있다면:

```bash
npx expo login
```

### 3. 프로젝트 초기화

프로젝트 디렉토리에서:

```bash
cd mobile
eas build:configure
```

이 명령어는 `eas.json` 파일을 생성합니다. (이미 생성되어 있음)

---

## ⚙️ 프로젝트 설정

### 1. app.config.js 업데이트

`app.config.js` 파일에서 다음 항목을 확인하고 업데이트하세요:

```javascript
// EAS 프로젝트 ID 업데이트 필요
extra: {
  eas: {
    projectId: "your-actual-project-id-here"; // ← 업데이트 필요
  }
}
```

EAS 프로젝트 ID를 얻으려면:

```bash
eas project:info
```

또는 Expo 대시보드에서 확인 가능합니다.

### 2. eas.json 설정 확인

`eas.json` 파일에 3가지 빌드 프로필이 정의되어 있습니다:

#### Development 빌드

- 개발 클라이언트 포함
- 시뮬레이터/에뮬레이터용
- 빠른 개발 및 테스트용

#### Preview 빌드

- 내부 테스트용
- APK (Android) / Ad-hoc (iOS)
- TestFlight 또는 직접 설치용

#### Production 빌드

- 스토어 제출용
- AAB (Android) / App Store (iOS)
- 자동 버전 증가 활성화

---

## 🚀 빌드 실행

### Development 빌드

개발 및 테스트용 빌드:

```bash
# 양쪽 플랫폼 모두
npm run eas:build:dev

# iOS만
npm run eas:build:dev:ios

# Android만
npm run eas:build:dev:android
```

**시뮬레이터/에뮬레이터 전용:**

```bash
# iOS 시뮬레이터용 빌드
eas build --profile development --platform ios --local

# Android 에뮬레이터용 빌드
eas build --profile development --platform android --local
```

### Preview 빌드

내부 테스트용 빌드:

```bash
# 양쪽 플랫폼 모두
npm run eas:build:preview

# iOS만 (TestFlight용)
npm run eas:build:preview:ios

# Android만 (APK)
npm run eas:build:preview:android
```

### Production 빌드

스토어 제출용 빌드:

```bash
# 양쪽 플랫폼 모두
npm run eas:build:prod

# iOS만 (App Store용)
npm run eas:build:prod:ios

# Android만 (Google Play용)
npm run eas:build:prod:android
```

### 로컬 빌드

클라우드 빌드 대신 로컬에서 빌드하려면:

```bash
# iOS (macOS 필요)
eas build --profile production --platform ios --local

# Android
eas build --profile production --platform android --local
```

**참고:** 로컬 빌드는 Android Studio (Android) 또는 Xcode (iOS)가 설치되어 있어야 합니다.

---

## 🎯 앱 스토어 제출

### iOS - App Store Connect

#### 1. 수동 제출

1. EAS 빌드 완료 후 `.ipa` 파일 다운로드
2. Xcode의 Transporter 앱 사용
3. App Store Connect에서 TestFlight 또는 App Store 배포

#### 2. 자동 제출 (권장)

```bash
npm run eas:submit:ios
```

또는 빌드와 동시에 제출:

```bash
eas build --platform ios --auto-submit
```

**첫 제출 전 설정:**

`eas.json`의 submit 섹션에서 다음 정보 업데이트:

```json
"ios": {
  "appleId": "your-apple-id@example.com",
  "ascAppId": "your-asc-app-id",
  "appleTeamId": "your-apple-team-id"
}
```

### Android - Google Play Console

#### 1. Service Account 설정

1. Google Cloud Console에서 Service Account 생성
2. JSON 키 파일 다운로드
3. Google Play Console에서 API 액세스 권한 부여

#### 2. 자동 제출

```bash
npm run eas:submit:android
```

**첫 제출 전 설정:**

```json
"android": {
  "serviceAccountKeyPath": "./google-play-service-account.json",
  "track": "internal"  // internal, alpha, beta, production
}
```

**트랙 옵션:**

- `internal`: 내부 테스트
- `alpha`: 알파 테스트
- `beta`: 베타 테스트
- `production`: 프로덕션 배포

---

## 🔄 OTA 업데이트

EAS Update를 사용하여 앱스토어 검토 없이 JavaScript 및 에셋 업데이트 배포:

### Development 채널

```bash
npm run eas:update:dev
```

### Preview 채널

```bash
npm run eas:update:preview
```

### Production 채널

```bash
npm run eas:update:prod
```

### 커스텀 메시지로 업데이트

```bash
eas update --branch production --message "버그 수정 및 성능 개선"
```

### 업데이트 롤백

```bash
# 이전 업데이트 확인
eas update:list --branch production

# 특정 업데이트로 롤백
eas update:republish --group <update-group-id>
```

---

## 🐛 문제 해결

### 빌드 실패

#### 1. 환경 변수 누락

```bash
# .env 파일 확인
cat .env.dev
cat .env.prod

# app.config.js에서 환경 변수 로드 확인
```

#### 2. Firebase 설정 파일 누락

```bash
# 파일 존재 확인
ls GoogleService-Info.plist
ls google-services.json
```

#### 3. 의존성 문제

```bash
# 캐시 클리어 및 재설치
rm -rf node_modules
npm install
```

#### 4. iOS 인증서 문제

```bash
# 인증서 재설정
eas credentials:reset --platform ios
```

### 빌드 로그 확인

```bash
# 최근 빌드 목록
eas build:list

# 특정 빌드 상세 정보
eas build:view <build-id>
```

### AdMob 통합 문제

AdMob이 프로덕션 빌드에서 작동하지 않는 경우:

1. **실제 AdMob App ID 사용 확인**

   ```javascript
   // .env.prod
   ADMOB_ANDROID_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
   ADMOB_IOS_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~zzzzzzzzzz
   ```

2. **google-services.json / GoogleService-Info.plist 확인**

3. **AdMob 계정에서 앱 등록 확인**

### EAS CLI 문제

```bash
# EAS CLI 업데이트
npm install -g eas-cli@latest

# 로그인 상태 확인
eas whoami

# 프로젝트 정보 확인
eas project:info
```

---

## 📊 빌드 상태 모니터링

### 웹 대시보드

[Expo 대시보드](https://expo.dev/)에서 빌드 상태 실시간 확인

### CLI로 확인

```bash
# 빌드 목록
eas build:list

# 특정 플랫폼
eas build:list --platform ios
eas build:list --platform android

# 빌드 상태 조회
eas build:view <build-id>

# 빌드 취소
eas build:cancel <build-id>
```

---

## 💡 베스트 프랙티스

### 1. 버전 관리

- **Semantic Versioning** 사용 (예: 1.0.0, 1.1.0, 2.0.0)
- iOS: `buildNumber` 자동 증가 활성화
- Android: `versionCode` 자동 증가 활성화

### 2. 환경 분리

- Development: 테스트 API 키, 테스트 AdMob ID
- Production: 실제 API 키, 실제 AdMob ID

### 3. 빌드 전 체크리스트

- [ ] 환경 변수 확인
- [ ] Firebase 설정 파일 확인
- [ ] AdMob App ID 확인
- [ ] 버전 번호 업데이트
- [ ] 변경사항 테스트 완료
- [ ] 스크린샷 및 설명 업데이트 (첫 배포 시)

### 4. 점진적 배포

1. **Development** 빌드로 내부 테스트
2. **Preview** 빌드로 베타 테스터 배포
3. **Production** 빌드로 스토어 제출

### 5. OTA 업데이트 전략

- **Minor 버그 수정**: OTA 업데이트 사용
- **네이티브 코드 변경**: 새 빌드 필요
- **Major 기능 추가**: 새 빌드 권장

---

## 🔗 유용한 링크

- [EAS Build 공식 문서](https://docs.expo.dev/build/introduction/)
- [EAS Submit 공식 문서](https://docs.expo.dev/submit/introduction/)
- [EAS Update 공식 문서](https://docs.expo.dev/eas-update/introduction/)
- [Expo 대시보드](https://expo.dev/)
- [AdMob 설정 가이드](./ADMOB_GUIDE.md)
- [환경 설정 가이드](./ENV_SETUP.md)

---

## 📞 지원

문제가 발생하면:

1. [Expo 포럼](https://forums.expo.dev/) 검색
2. [Discord](https://discord.gg/expo) 커뮤니티 문의
3. [GitHub Issues](https://github.com/expo/expo/issues) 확인

---

**업데이트:** 2025년 10월  
**버전:** 1.0.0
