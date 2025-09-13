# 🎵 ToneTuner - 텍스트 톤 변환기

TypeScript와 React를 사용한 AI 기반 텍스트 톤 변환 서비스입니다.

## ✨ 주요 기능

- **텍스트 입력**: 변환하고 싶은 텍스트를 자유롭게 입력
- **톤 선택**: 4가지 톤 중 선택 (정중한 톤, 캐주얼 톤, 친근한 톤, 전문적인 톤)
- **AI 변환**: 패턴 매칭과 규칙 기반으로 텍스트 톤 변환
- **결과 복사**: 변환된 텍스트를 원클릭으로 복사
- **히스토리 저장**: 변환 기록을 로컬에 저장
- **반응형 디자인**: 모바일과 데스크톱에서 최적화된 사용자 경험
- **PWA 지원**: 앱처럼 설치하여 사용 가능

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript
- **상태 관리**: Zustand
- **스타일링**: CSS3 (Grid, Flexbox)
- **폰트**: Google Fonts (Inter)
- **빌드 도구**: Create React App
- **PWA**: Web App Manifest

## 📁 프로젝트 구조

```
src/
├── types/
│   ├── api.ts           # API 응답 타입
│   ├── tone.ts          # 톤 관련 타입
│   └── index.ts         # 타입 export
├── services/
│   └── aiService.ts     # AI 서비스 (API 호출)
├── components/
│   ├── TextInput.tsx    # 텍스트 입력 컴포넌트
│   ├── ToneSelector.tsx # 톤 선택 컴포넌트
│   └── ResultDisplay.tsx # 결과 표시 컴포넌트
├── screens/
│   └── MainScreen.tsx   # 메인 화면
├── stores/
│   └── appStore.ts      # Zustand 스토어
├── App.tsx              # 메인 앱 컴포넌트
├── App.css              # 앱 스타일
├── index.tsx            # 앱 진입점
└── index.css            # 글로벌 스타일
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 16.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

### 환경 변수 설정

`.env` 파일을 생성하여 AI API 설정:

```env
REACT_APP_AI_API_URL=https://api.openai.com
REACT_APP_AI_API_KEY=your_api_key_here
```

## 🎨 컴포넌트 구조

### TextInput

- 텍스트 입력을 위한 textarea 컴포넌트
- Ctrl+Enter 키보드 단축키 지원
- 실시간 입력 검증

### ToneSelector

- 4가지 톤 옵션을 선택할 수 있는 라디오 버튼 그룹
- 시각적 톤 카드 디자인
- 접근성 고려한 키보드 네비게이션

### ResultDisplay

- 변환 결과를 표시하는 컴포넌트
- 원클릭 복사 기능
- 원본 텍스트 비교 기능
- 로딩 상태 표시

## 🔧 상태 관리

Zustand를 사용한 전역 상태 관리:

- `inputText`: 입력된 텍스트
- `selectedTone`: 선택된 톤
- `conversionResult`: 변환 결과
- `conversionHistory`: 변환 히스토리
- `isLoading`: 로딩 상태
- `error`: 에러 상태

## 🎯 지원 톤

### 1. 정중한 톤 (🎩)

- 공식적이고 예의바른 표현
- 비즈니스 문서, 공식 서신에 적합

### 2. 캐주얼 톤 (😊)

- 친근하고 편안한 표현
- 일상 대화, SNS에 적합

### 3. 친근한 톤 (🤝)

- 따뜻하고 친근한 표현
- 고객 서비스, 개인적 소통에 적합

### 4. 전문적인 톤 (💼)

- 업무용 전문적 표현
- 보고서, 제안서에 적합

## 🔮 향후 개선 계획

- [ ] 실제 AI API 연동 (OpenAI, Claude 등)
- [ ] 더 정교한 톤 변환 알고리즘
- [ ] 변환 히스토리 관리 UI
- [ ] 다국어 지원
- [ ] 사용자 맞춤 톤 설정
- [ ] 텍스트 길이 제한 및 최적화
- [ ] 다크 모드 지원
- [ ] 키보드 단축키 확장

## 📄 라이선스

MIT License

## 🤝 기여하기

버그 리포트, 기능 제안, 풀 리퀘스트를 환영합니다!

---

**ToneTuner**로 더 나은 소통을 만들어가세요! 🎵
