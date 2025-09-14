// 톤 관련 타입 정의

export type ToneType = "formal" | "casual" | "friendly" | "professional";

export interface ToneOption {
  id: ToneType;
  name: string;
  description: string;
  icon: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "formal",
    name: "정중한 톤",
    description: "공식적이고 예의바른 표현",
    icon: "🎩",
  },
  {
    id: "casual",
    name: "캐주얼 톤",
    description: "친근하고 편안한 표현",
    icon: "😊",
  },
  {
    id: "friendly",
    name: "친근한 톤",
    description: "따뜻하고 친근한 표현",
    icon: "🤝",
  },
  {
    id: "professional",
    name: "전문적인 톤",
    description: "업무용 전문적 표현",
    icon: "💼",
  },
];

export interface ToneConversionRequest {
  text: string;
  tone: ToneType;
}

export interface ToneConversionResponse {
  originalText: string;
  convertedText: string;
  tone: ToneType;
  timestamp: number;
}
