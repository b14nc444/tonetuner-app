# AdMob 배너 광고 적용 가이드

## 개요

ToneTuner 앱에 Google AdMob 배너 광고가 적용되었습니다. 이 문서는 AdMob 광고 설정 및 사용 방법을 설명합니다.

## 적용된 내용

### 1. 설치된 패키지

- `react-native-google-mobile-ads`: Google AdMob을 React Native에서 사용하기 위한 공식 패키지

### 2. 광고 위치

배너 광고는 다음 두 위치에 표시됩니다:

1. **상단 배너**: 헤더 바로 아래
2. **하단 배너**: 푸터 바로 아래

### 3. 컴포넌트 구조

```
src/
├── components/
│   ├── AdBanner.native.tsx  # Native 앱용 배너 광고 컴포넌트
│   └── AdBanner.tsx         # 웹용 배너 광고 컴포넌트 (빈 컴포넌트)
└── screens/
    └── MainScreen.native.tsx # 배너 광고가 포함된 메인 화면
```

## 설정 방법

### 1. 환경 변수 설정

`.env.dev` 또는 `.env.prod` 파일에 AdMob 관련 환경 변수를 추가합니다.

**개발 환경 (.env.dev):**

```env
# 테스트용 AdMob ID (실제 광고가 노출되지 않음)
ADMOB_ANDROID_APP_ID=ca-app-pub-3940256099942544~3347511713
ADMOB_IOS_APP_ID=ca-app-pub-3940256099942544~1458002511
# 테스트용 배너 광고 단위 ID (OS별로 다름)
ADMOB_ANDROID_BANNER_AD_UNIT_ID=ca-app-pub-3940256099942544/6300978111
ADMOB_IOS_BANNER_AD_UNIT_ID=ca-app-pub-3940256099942544/2934735716
```

**프로덕션 환경 (.env.prod):**

```env
# 실제 AdMob ID를 입력하세요
ADMOB_ANDROID_APP_ID=your_real_admob_android_app_id_here
ADMOB_IOS_APP_ID=your_real_admob_ios_app_id_here
# 실제 배너 광고 단위 ID (OS별로 다름)
ADMOB_ANDROID_BANNER_AD_UNIT_ID=your_real_android_banner_ad_unit_id_here
ADMOB_IOS_BANNER_AD_UNIT_ID=your_real_ios_banner_ad_unit_id_here
```

### 2. AdMob 앱 ID 발급받기

1. [Google AdMob 콘솔](https://apps.admob.com/)에 로그인
2. **앱** → **앱 추가** 클릭
3. 플랫폼 선택 (Android/iOS)
4. 앱 정보 입력
5. 발급받은 **앱 ID**를 `.env.prod` 파일에 입력

### 3. 광고 단위 ID 발급받기

**Android 광고 단위:**

1. AdMob 콘솔에서 Android 앱 선택
2. **광고 단위** → **광고 단위 추가** 클릭
3. **배너** 선택
4. 광고 단위 이름 입력 (예: "Android 메인 화면 배너")
5. 설정 완료 후 발급받은 **광고 단위 ID**를 `.env.prod`의 `ADMOB_ANDROID_BANNER_AD_UNIT_ID`에 입력

**iOS 광고 단위:**

1. AdMob 콘솔에서 iOS 앱 선택
2. **광고 단위** → **광고 단위 추가** 클릭
3. **배너** 선택
4. 광고 단위 이름 입력 (예: "iOS 메인 화면 배너")
5. 설정 완료 후 발급받은 **광고 단위 ID**를 `.env.prod`의 `ADMOB_IOS_BANNER_AD_UNIT_ID`에 입력

**⚠️ 중요:** Android와 iOS 각각 별도의 광고 단위를 생성해야 합니다.

### 4. app.json/app.config.js 설정

이미 설정이 완료되어 있습니다:

```javascript
// Android
android: {
  config: {
    googleMobileAdsAppId: process.env.ADMOB_ANDROID_APP_ID || "테스트 ID";
  }
}

// iOS
ios: {
  config: {
    googleMobileAdsAppId: process.env.ADMOB_IOS_APP_ID || "테스트 ID";
  }
}
```

## 사용 방법

### 기본 사용

```tsx
import { AdBanner } from "../components";

function MyScreen() {
  return (
    <View>
      <AdBanner variant="banner" />
    </View>
  );
}
```

### 광고 크기 옵션

`AdBanner` 컴포넌트는 다음 크기 옵션을 지원합니다:

- `banner`: 표준 배너 (320x50)
- `large`: 큰 배너 (320x100)
- `medium`: 중간 사각형 (300x250)
- `full`: 전체 너비 배너 (468x60)

```tsx
<AdBanner variant="banner" />   {/* 기본값 */}
<AdBanner variant="large" />
<AdBanner variant="medium" />
<AdBanner variant="full" />
```

### 스타일 커스터마이징

```tsx
<AdBanner variant="banner" style={{ marginVertical: 20 }} />
```

## 테스트

### 개발 환경에서 테스트

개발 환경(`__DEV__`)에서는 자동으로 Google의 테스트 광고 ID가 사용됩니다:

```typescript
const getAdUnitId = () => {
  if (__DEV__) {
    return TestIds.ADAPTIVE_BANNER;
  }

  return Platform.select({
    ios: process.env.ADMOB_IOS_BANNER_AD_UNIT_ID,
    android: process.env.ADMOB_ANDROID_BANNER_AD_UNIT_ID,
  });
};
```

이렇게 하면 개발 중에 실제 광고 노출이 발생하지 않아 계정이 정지되는 위험을 방지할 수 있으며, 프로덕션에서는 플랫폼별로 적절한 광고 단위 ID가 자동으로 선택됩니다.

### 실제 광고 테스트

프로덕션 빌드에서 실제 광고를 테스트하려면:

1. 실제 AdMob ID를 `.env.prod`에 설정
2. 프로덕션 모드로 빌드: `npm run build:prod`
3. 실제 디바이스에서 테스트

**⚠️ 주의:** 본인의 광고를 클릭하지 마세요. 계정 정지될 수 있습니다.

## 광고 이벤트 처리

광고 로드 성공/실패 이벤트는 콘솔에 로그로 출력됩니다:

```typescript
onAdLoaded={() => {
  console.log("AdMob 배너 광고 로드 완료");
}}
onAdFailedToLoad={(error) => {
  console.log("AdMob 배너 광고 로드 실패:", error);
}}
```

필요에 따라 이벤트 핸들러를 수정하여 커스텀 동작을 추가할 수 있습니다.

## 주의사항

1. **테스트 광고 사용**: 개발 중에는 반드시 테스트 광고 ID를 사용하세요.
2. **본인 클릭 금지**: 본인의 광고를 클릭하면 계정이 정지될 수 있습니다.
3. **광고 정책 준수**: [Google AdMob 정책](https://support.google.com/admob/answer/6128543)을 준수하세요.
4. **개인정보 보호**: `requestNonPersonalizedAdsOnly: true` 옵션이 설정되어 있어 개인화되지 않은 광고만 표시됩니다.

## 문제 해결

### 광고가 표시되지 않는 경우

1. **환경 변수 확인**
   - `.env.dev` 또는 `.env.prod` 파일이 올바른 위치에 있는지 확인
   - AdMob ID가 올바르게 설정되었는지 확인

2. **app.config.js 확인**
   - AdMob 앱 ID가 올바르게 설정되었는지 확인

3. **앱 재시작**
   - 환경 변수를 변경한 후에는 앱을 완전히 재시작해야 합니다
   - `npm run start:dev` 또는 `npm run start:prod`

4. **AdMob 콘솔 확인**
   - 광고 단위가 활성화되어 있는지 확인
   - 새로 생성한 광고 단위는 활성화되는 데 몇 시간이 걸릴 수 있습니다

5. **네트워크 연결 확인**
   - 광고를 로드하려면 인터넷 연결이 필요합니다

### 에러 메시지 확인

광고 로드 실패 시 콘솔에 에러 메시지가 출력됩니다:

```
AdMob 배너 광고 로드 실패: [Error details]
```

에러 메시지를 확인하여 문제를 진단할 수 있습니다.

## 추가 기능

### 광고 새로고침

배너 광고는 자동으로 주기적으로 새로고침됩니다. 기본적으로 30-120초 간격으로 새로운 광고가 로드됩니다.

### 다른 광고 형식 추가

필요한 경우 다음 광고 형식도 추가할 수 있습니다:

- **전면 광고 (Interstitial)**: 전체 화면을 덮는 광고
- **보상형 광고 (Rewarded)**: 사용자에게 보상을 제공하는 광고
- **네이티브 광고 (Native)**: 앱 디자인에 통합되는 광고

## 참고 자료

- [React Native Google Mobile Ads 공식 문서](https://docs.page/invertase/react-native-google-mobile-ads)
- [Google AdMob 시작 가이드](https://support.google.com/admob/answer/7356431)
- [AdMob 정책 센터](https://support.google.com/admob/answer/6128543)
