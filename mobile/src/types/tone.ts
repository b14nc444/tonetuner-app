// 톤 관련 타입 정의

export type ToneType = "formal" | "casual" | "friendly" | "short";

export interface ToneOption {
  id: ToneType;
  name: string;
  description: string;
  icon: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "formal",
    name: "정중",
    description: "문서나 이메일에 딱!",
    icon: "🎩",
  },
  {
    id: "casual",
    name: "캐주얼",
    description: "편하고 자연스러운 문장",
    icon: "😊",
  },
  {
    id: "friendly",
    name: "친근",
    description: "부드럽고 따뜻한 표현",
    icon: "🤝",
  },
  {
    id: "short",
    name: "간결",
    description: "핵심만 짧고 명확하게",
    icon: "✂️",
  },
];

export interface ToneConversionRequest {
  text: string;
  tone: ToneType;
}

export interface ToneConversionResponse {
  id: string;
  originalText: string;
  convertedText: string;
  tone: ToneType;
  timestamp: number;
  wordCount: number;
  processingTime: number;
}

export interface ToneConversionHistory {
  id: string;
  request: ToneConversionRequest;
  response: ToneConversionResponse;
  createdAt: number;
}
