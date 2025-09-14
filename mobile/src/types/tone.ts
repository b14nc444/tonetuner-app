// 톤 관련 타입 정의

export type ToneType = "formal" | "casual" | "friendly" | "professional";

export interface ToneOption {
  id: ToneType;
  name: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "formal",
    name: "정중한 톤",
    description: "공식적이고 예의바른 표현",
    icon: "🎩",
    color: "#495057",
    backgroundColor: "#f8f9fa",
  },
  {
    id: "casual",
    name: "캐주얼 톤",
    description: "친근하고 편안한 표현",
    icon: "😊",
    color: "#28a745",
    backgroundColor: "#d4edda",
  },
  {
    id: "friendly",
    name: "친근한 톤",
    description: "따뜻하고 친근한 표현",
    icon: "🤝",
    color: "#007bff",
    backgroundColor: "#cce7ff",
  },
  {
    id: "professional",
    name: "전문적인 톤",
    description: "업무용 전문적 표현",
    icon: "💼",
    color: "#6f42c1",
    backgroundColor: "#e2d9f3",
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
