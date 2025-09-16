import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  AppState,
  ToneConversionHistory,
  ToneConversionResponse,
  ToneType,
} from "../types";

interface AppStore extends AppState {
  // 상태
  inputText: string;
  selectedTone: ToneType;
  conversionResult: ToneConversionResponse | null;
  conversionHistory: ToneConversionHistory[];

  // 액션
  setInputText: (text: string) => void;
  setSelectedTone: (tone: ToneType) => void;
  setConversionResult: (result: ToneConversionResponse | null) => void;
  addToHistory: (result: ToneConversionResponse) => void;
  clearHistory: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentScreen: (screen: "main" | "history" | "settings") => void;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: "ko" | "en") => void;

  // 복합 액션
  reset: () => void;
  convertText: () => Promise<void>;
}

const initialState: Omit<AppStore, "actions"> = {
  // AppState
  currentScreen: "main",
  isLoading: false,
  error: null,
  theme: "light",
  language: "ko",

  // AppStore specific
  inputText: "",
  selectedTone: "formal",
  conversionResult: null,
  conversionHistory: [],
  setInputText: function (text: string): void {
    throw new Error("Function not implemented.");
  },
  setSelectedTone: function (tone: ToneType): void {
    throw new Error("Function not implemented.");
  },
  setConversionResult: function (result: ToneConversionResponse | null): void {
    throw new Error("Function not implemented.");
  },
  addToHistory: function (result: ToneConversionResponse): void {
    throw new Error("Function not implemented.");
  },
  clearHistory: function (): void {
    throw new Error("Function not implemented.");
  },
  setLoading: function (isLoading: boolean): void {
    throw new Error("Function not implemented.");
  },
  setError: function (error: string | null): void {
    throw new Error("Function not implemented.");
  },
  setCurrentScreen: function (screen: "main" | "history" | "settings"): void {
    throw new Error("Function not implemented.");
  },
  setTheme: function (theme: "light" | "dark"): void {
    throw new Error("Function not implemented.");
  },
  setLanguage: function (language: "ko" | "en"): void {
    throw new Error("Function not implemented.");
  },
  reset: function (): void {
    throw new Error("Function not implemented.");
  },
  convertText: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 기본 상태 업데이트
        setInputText: (text: string) => set({ inputText: text }),
        setSelectedTone: (tone: ToneType) => set({ selectedTone: tone }),
        setConversionResult: (result: ToneConversionResponse | null) =>
          set({ conversionResult: result }),

        // 히스토리 관리
        addToHistory: (result: ToneConversionResponse) =>
          set((state) => {
            const historyItem: ToneConversionHistory = {
              id: result.id,
              request: {
                text: result.originalText,
                tone: result.tone,
              },
              response: result,
              createdAt: result.timestamp,
            };
            return {
              conversionHistory: [
                historyItem,
                ...state.conversionHistory,
              ].slice(0, 50), // 최대 50개 유지
            };
          }),
        clearHistory: () => set({ conversionHistory: [] }),

        // 로딩 및 에러 상태
        setLoading: (isLoading: boolean) => set({ isLoading }),
        setError: (error: string | null) => set({ error }),
        setCurrentScreen: (screen: "main" | "history" | "settings") =>
          set({ currentScreen: screen }),
        setTheme: (theme: "light" | "dark") => set({ theme }),
        setLanguage: (language: "ko" | "en") => set({ language }),

        // 복합 액션
        reset: () =>
          set({
            ...initialState,
            conversionHistory: get().conversionHistory, // 히스토리는 유지
          }),

        // 텍스트 변환 (AI 서비스 호출)
        convertText: async () => {
          const { inputText, selectedTone } = get();

          if (!inputText.trim()) {
            set({ error: "변환할 텍스트를 입력해주세요." });
            return;
          }

          set({ isLoading: true, error: null });

          try {
            // AI 서비스 import (동적 import로 순환 참조 방지)
            const { aiService } = await import("../services/aiService");

            // 실제 AI API 사용
            const response = await aiService.convertTone({
              text: inputText,
              tone: selectedTone,
            });

            if (response.success && response.data) {
              const result = response.data;
              set({
                conversionResult: result,
                isLoading: false,
              });

              // 히스토리에 추가
              get().addToHistory(result);
            } else {
              set({
                error: response.error || "변환에 실패했습니다.",
                isLoading: false,
              });
            }
          } catch (error) {
            console.error("변환 오류:", error);
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "알 수 없는 오류가 발생했습니다.",
              isLoading: false,
            });
          }
        },
      }),
      {
        name: "tonetuner-store",
        partialize: (state) => ({
          conversionHistory: state.conversionHistory,
          selectedTone: state.selectedTone,
        }),
      }
    ),
    {
      name: "tonetuner-store",
    }
  )
);

// 선택적 셀렉터들 (성능 최적화)
export const useInputText = () => useAppStore((state) => state.inputText);
export const useSelectedTone = () => useAppStore((state) => state.selectedTone);
export const useConversionResult = () =>
  useAppStore((state) => state.conversionResult);
export const useConversionHistory = () =>
  useAppStore((state) => state.conversionHistory);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
