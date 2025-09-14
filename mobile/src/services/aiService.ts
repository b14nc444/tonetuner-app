import {
  AIRequest,
  AIResponse,
  ApiResponse,
  ToneConversionRequest,
  ToneConversionResponse,
  ToneType,
} from "../types";
import { config, validateConfig } from "./config";

// AI 서비스 클래스
export class AIService {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor(config: { baseUrl: string; apiKey: string; timeout?: number }) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;
  }

  /**
   * 텍스트 톤 변환 (실제 AI API 호출)
   */
  async convertTone(
    request: ToneConversionRequest
  ): Promise<ApiResponse<ToneConversionResponse>> {
    try {
      const aiRequest: AIRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(request.tone),
          },
          {
            role: "user",
            content: request.text,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      };

      const response = await this.makeRequest(
        "/v1/chat/completions",
        aiRequest
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "AI 서비스 호출 실패");
      }

      const aiResponse = response.data as AIResponse;
      const convertedText = aiResponse.choices[0]?.message?.content || "";

      const startTime = Date.now();
      const wordCount = request.text.split(/\s+/).length;
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          originalText: request.text,
          convertedText: convertedText.trim(),
          tone: request.tone,
          timestamp: Date.now(),
          wordCount,
          processingTime,
        },
      };
    } catch (error) {
      console.error("AI 서비스 오류:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  }

  /**
   * 톤별 시스템 프롬프트 생성
   */
  private getSystemPrompt(tone: ToneType): string {
    const prompts = {
      formal:
        "다음 텍스트를 정중하고 공식적인 톤으로 변환해주세요. 존댓말을 사용하고 예의바른 표현으로 작성해주세요.",
      casual:
        "다음 텍스트를 캐주얼하고 편안한 톤으로 변환해주세요. 친근하고 일상적인 표현으로 작성해주세요.",
      friendly:
        "다음 텍스트를 친근하고 따뜻한 톤으로 변환해주세요. 상냥하고 배려심 있는 표현으로 작성해주세요.",
      professional:
        "다음 텍스트를 전문적이고 업무적인 톤으로 변환해주세요. 명확하고 효율적인 표현으로 작성해주세요.",
    };

    return prompts[tone];
  }

  /**
   * AI API 요청 실행
   */
  private async makeRequest(
    endpoint: string,
    data: AIRequest
  ): Promise<ApiResponse<AIResponse>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("요청 시간이 초과되었습니다.");
      }

      throw error;
    }
  }

  /**
   * 로컬 시뮬레이션 (개발/테스트용)
   */
  async convertToneLocal(
    request: ToneConversionRequest
  ): Promise<ApiResponse<ToneConversionResponse>> {
    // 실제 AI API 대신 로컬 시뮬레이션
    const toneRules = {
      formal: {
        patterns: [
          { from: /안녕/g, to: "안녕하십니까" },
          { from: /고마워/g, to: "감사합니다" },
          { from: /미안해/g, to: "죄송합니다" },
          { from: /잘 지내/g, to: "안녕히 지내고 계십니까" },
          { from: /어떻게 지내/g, to: "어떻게 지내고 계십니까" },
          { from: /뭐해/g, to: "무엇을 하고 계십니까" },
          { from: /어디야/g, to: "어디에 계십니까" },
        ],
        suffix: "습니다",
        prefix: "정중히 말씀드리면, ",
      },
      casual: {
        patterns: [
          { from: /안녕하세요/g, to: "안녕" },
          { from: /감사합니다/g, to: "고마워" },
          { from: /죄송합니다/g, to: "미안해" },
          { from: /안녕히 지내고 계십니까/g, to: "잘 지내" },
          { from: /어떻게 지내고 계십니까/g, to: "어떻게 지내" },
          { from: /무엇을 하고 계십니까/g, to: "뭐해" },
          { from: /어디에 계십니까/g, to: "어디야" },
        ],
        suffix: "어",
        prefix: "",
      },
      friendly: {
        patterns: [
          { from: /안녕하세요/g, to: "안녕하세요!" },
          { from: /감사합니다/g, to: "정말 고마워요!" },
          { from: /죄송합니다/g, to: "정말 죄송해요" },
          { from: /안녕히 지내고 계십니까/g, to: "잘 지내고 계세요?" },
          { from: /어떻게 지내고 계십니까/g, to: "어떻게 지내고 계세요?" },
          { from: /무엇을 하고 계십니까/g, to: "뭐 하고 계세요?" },
          { from: /어디에 계십니까/g, to: "어디 계세요?" },
        ],
        suffix: "요",
        prefix: "친근하게 말씀드리면, ",
      },
      professional: {
        patterns: [
          { from: /안녕/g, to: "안녕하세요" },
          { from: /고마워/g, to: "감사드립니다" },
          { from: /미안해/g, to: "죄송합니다" },
          { from: /잘 지내/g, to: "안녕히 지내고 계십니까" },
          { from: /어떻게 지내/g, to: "어떻게 지내고 계십니까" },
          { from: /뭐해/g, to: "무엇을 하고 계십니까" },
          { from: /어디야/g, to: "어디에 계십니까" },
        ],
        suffix: "니다",
        prefix: "업무상 말씀드리면, ",
      },
    };

    const rule = toneRules[request.tone];
    let convertedText = request.text;

    // 패턴 매칭으로 텍스트 변환
    rule.patterns.forEach((pattern) => {
      convertedText = convertedText.replace(pattern.from, pattern.to);
    });

    // 접두사와 접미사 추가
    if (rule.prefix) {
      convertedText = rule.prefix + convertedText;
    }

    if (rule.suffix && !convertedText.match(/[.!?]$/)) {
      convertedText += rule.suffix;
    }

    // 시뮬레이션을 위한 지연
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    const startTime = Date.now();
    const wordCount = request.text.split(/\s+/).length;
    const processingTime = Date.now() - startTime;

    return {
      success: true,
      data: {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        originalText: request.text,
        convertedText: convertedText,
        tone: request.tone,
        timestamp: Date.now(),
        wordCount,
        processingTime,
      },
    };
  }
}

// 기본 인스턴스 생성
export const aiService = new AIService({
  baseUrl: config.apiBaseUrl,
  apiKey: config.openaiApiKey || "",
  timeout: 30000,
});

// 환경 변수 검증
if (!validateConfig()) {
  console.warn(
    "환경 변수가 올바르게 설정되지 않았습니다. .env 파일을 확인해주세요."
  );
}
