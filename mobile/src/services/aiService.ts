import {
  AIRequest,
  AIResponse,
  ApiResponse,
  ToneConversionRequest,
  ToneConversionResponse,
  ToneType,
} from "../types";
import { config, validateConfig } from "./config";

// 재시도 설정 인터페이스
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

// 에러 타입 정의
interface AIServiceError extends Error {
  code?: string;
  statusCode?: number;
  retryable?: boolean;
}

// AI 서비스 클래스
export class AIService {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;
  private retryConfig: RetryConfig;

  constructor(config: { baseUrl: string; apiKey: string; timeout?: number }) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    };
  }

  /**
   * 텍스트 톤 변환 (실제 AI API 호출)
   */
  async convertTone(
    request: ToneConversionRequest
  ): Promise<ApiResponse<ToneConversionResponse>> {
    const startTime = Date.now();

    try {
      // 입력 검증
      if (!this.validateInput(request)) {
        return {
          success: false,
          error: "입력 텍스트가 유효하지 않습니다.",
        };
      }

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
        temperature: this.getTemperatureForTone(request.tone),
        max_tokens: this.getMaxTokensForTone(request.tone),
      };

      // 재시도 로직과 함께 API 호출
      const response = await this.makeRequestWithRetry(
        "/v1/chat/completions",
        aiRequest
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "AI 서비스 호출 실패");
      }

      // 응답 검증 및 파싱
      const aiResponse = this.validateAndParseResponse(response.data);
      const convertedText = this.extractConvertedText(aiResponse);

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
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * 톤별 시스템 프롬프트 생성
   */
  private getSystemPrompt(tone: ToneType): string {
    const prompts: Record<ToneType, string> = {
      formal:
        "다음 텍스트를 정중하고 공식적인 톤으로 변환해주세요. 존댓말을 사용하고 예의바른 표현으로 작성해주세요. 문장을 완전하고 정중하게 마무리해주세요.",
      casual:
        "다음 텍스트를 캐주얼하고 편안한 톤으로 변환해주세요. 친근하고 일상적인 표현으로 작성해주세요. 자연스럽고 편안한 말투로 작성해주세요.",
      friendly:
        "다음 텍스트를 친근하고 따뜻한 톤으로 변환해주세요. 상냥하고 배려심 있는 표현으로 작성해주세요. 따뜻하고 친근한 느낌이 들도록 작성해주세요.",
      short:
        "다음 텍스트를 간결하고 핵심적인 톤으로 변환해주세요. 불필요한 단어는 제거하고 핵심만 명확하게 전달해주세요. 짧고 명확한 문장으로 작성해주세요.",
    };

    return prompts[tone];
  }

  /**
   * 톤별 온도 설정
   */
  private getTemperatureForTone(tone: ToneType): number {
    const temperatures: Record<ToneType, number> = {
      formal: 0.3, // 일관된 정중한 톤
      casual: 0.7, // 자연스러운 캐주얼 톤
      friendly: 0.5, // 따뜻하지만 일관된 톤
      short: 0.2, // 간결하고 정확한 톤
    };

    return temperatures[tone];
  }

  /**
   * 톤별 최대 토큰 수 설정
   */
  private getMaxTokensForTone(tone: ToneType): number {
    const maxTokens: Record<ToneType, number> = {
      formal: 600, // 정중한 표현은 더 길 수 있음
      casual: 500, // 일반적인 길이
      friendly: 550, // 친근한 표현은 약간 더 길 수 있음
      short: 200, // 간결한 표현은 짧게
    };

    return maxTokens[tone];
  }

  /**
   * 입력 검증
   */
  private validateInput(request: ToneConversionRequest): boolean {
    if (!request.text || typeof request.text !== "string") {
      return false;
    }

    if (request.text.trim().length === 0) {
      return false;
    }

    if (request.text.length > 2000) {
      return false;
    }

    if (!["formal", "casual", "friendly", "short"].includes(request.tone)) {
      return false;
    }

    return true;
  }

  /**
   * 응답 검증 및 파싱
   */
  private validateAndParseResponse(data: any): AIResponse {
    if (!data || typeof data !== "object") {
      throw new Error("유효하지 않은 응답 형식입니다.");
    }

    if (
      !data.choices ||
      !Array.isArray(data.choices) ||
      data.choices.length === 0
    ) {
      throw new Error("응답에 선택지가 없습니다.");
    }

    const choice = data.choices[0];
    if (!choice.message || !choice.message.content) {
      throw new Error("응답에 메시지 내용이 없습니다.");
    }

    return data as AIResponse;
  }

  /**
   * 변환된 텍스트 추출
   */
  private extractConvertedText(aiResponse: AIResponse): string {
    const content = aiResponse.choices[0]?.message?.content;

    if (!content || typeof content !== "string") {
      throw new Error("변환된 텍스트를 추출할 수 없습니다.");
    }

    // 기본적인 정리
    let convertedText = content.trim();

    // 빈 응답 체크
    if (convertedText.length === 0) {
      throw new Error("변환된 텍스트가 비어있습니다.");
    }

    return convertedText;
  }

  /**
   * 에러 메시지 생성
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return "알 수 없는 오류가 발생했습니다.";
  }

  /**
   * 재시도 로직과 함께 AI API 요청 실행
   */
  private async makeRequestWithRetry(
    endpoint: string,
    data: AIRequest
  ): Promise<ApiResponse<AIResponse>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const response = await this.makeRequest(endpoint, data);
        return response;
      } catch (error) {
        lastError = error as Error;

        // 재시도 가능한 에러인지 확인
        if (
          !this.isRetryableError(error) ||
          attempt === this.retryConfig.maxRetries
        ) {
          throw error;
        }

        // 지수 백오프로 대기
        const delay = Math.min(
          this.retryConfig.baseDelay *
            Math.pow(this.retryConfig.backoffMultiplier, attempt),
          this.retryConfig.maxDelay
        );

        console.warn(
          `API 요청 실패 (시도 ${attempt + 1}/${this.retryConfig.maxRetries + 1}):`,
          error
        );
        console.log(`${delay}ms 후 재시도합니다...`);

        await this.sleep(delay);
      }
    }

    throw lastError || new Error("최대 재시도 횟수를 초과했습니다.");
  }

  /**
   * 재시도 가능한 에러인지 확인
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // 네트워크 에러
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        return true;
      }

      // HTTP 5xx 에러 (서버 에러)
      if (error.message.includes("HTTP 5")) {
        return true;
      }

      // Rate limit 에러
      if (
        error.message.includes("rate limit") ||
        error.message.includes("429")
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * 지연 함수
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * AI API 요청 실행 (단일 요청)
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
        const errorMessage =
          errorData.error?.message ||
          `HTTP ${response.status}: ${response.statusText}`;

        const error = new Error(errorMessage) as AIServiceError;
        error.statusCode = response.status;
        error.code = errorData.error?.code;

        throw error;
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError = new Error(
          "요청 시간이 초과되었습니다."
        ) as AIServiceError;
        timeoutError.retryable = true;
        throw timeoutError;
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
    const toneRules: Record<
      ToneType,
      {
        patterns: Array<{ from: RegExp; to: string }>;
        suffix: string;
        prefix: string;
      }
    > = {
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
      short: {
        patterns: [
          { from: /안녕하세요/g, to: "안녕" },
          { from: /감사합니다/g, to: "고마워" },
          { from: /죄송합니다/g, to: "미안" },
          { from: /안녕히 지내고 계십니까/g, to: "잘 지내?" },
          { from: /어떻게 지내고 계십니까/g, to: "어떻게 지내?" },
          { from: /무엇을 하고 계십니까/g, to: "뭐해?" },
          { from: /어디에 계십니까/g, to: "어디?" },
          { from: /정말/g, to: "" },
          { from: /정중히 말씀드리면/g, to: "" },
          { from: /친근하게 말씀드리면/g, to: "" },
          { from: /업무상 말씀드리면/g, to: "" },
        ],
        suffix: "",
        prefix: "",
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
