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

  // 변환 횟수 관련 상태
  dailyConversionCount: number;
  lastConversionDate: string | null;
  maxDailyConversions: number;

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

  // 변환 횟수 관련 액션
  incrementConversionCount: () => void;
  resetDailyCount: () => void;
  checkAndResetDailyCount: () => void;
  canConvert: () => boolean;

  // 복합 액션
  reset: () => void;
  convertText: () => Promise<void>;
}

const initialState = {
  // AppState
  currentScreen: "main" as const,
  isLoading: false,
  error: null as string | null,
  theme: "light" as const,
  language: "ko" as const,

  // AppStore specific
  inputText: "",
  selectedTone: "formal" as ToneType,
  conversionResult: null as ToneConversionResponse | null,
  conversionHistory: [] as ToneConversionHistory[],

  // 변환 횟수 관련 초기값
  dailyConversionCount: 0,
  lastConversionDate: null as string | null,
  maxDailyConversions: 999,
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

        // 변환 횟수 관련 액션
        incrementConversionCount: () =>
          set((state) => {
            const today = new Date().toDateString();
            const newCount =
              state.lastConversionDate === today
                ? state.dailyConversionCount + 1
                : 1;

            return {
              dailyConversionCount: newCount,
              lastConversionDate: today,
            };
          }),

        resetDailyCount: () =>
          set({
            dailyConversionCount: 0,
            lastConversionDate: null,
          }),

        checkAndResetDailyCount: () =>
          set((state) => {
            const today = new Date().toDateString();
            if (state.lastConversionDate !== today) {
              return {
                dailyConversionCount: 0,
                lastConversionDate: today,
              };
            }
            return state;
          }),

        canConvert: () => {
          const state = get();
          const today = new Date().toDateString();

          // 날짜가 바뀌었으면 카운트 리셋
          if (state.lastConversionDate !== today) {
            state.checkAndResetDailyCount();
            return true;
          }

          return state.dailyConversionCount < state.maxDailyConversions;
        },

        // 복합 액션
        reset: () =>
          set((state) => ({
            ...initialState,
            conversionHistory: state.conversionHistory, // 히스토리는 유지
          })),

        // 텍스트 변환 (AI 서비스 호출)
        convertText: async () => {
          const {
            inputText,
            selectedTone,
            canConvert,
            incrementConversionCount,
          } = get();

          if (!inputText.trim()) {
            set({ error: "변환할 텍스트를 입력해주세요." });
            return;
          }

          // 변환 횟수 체크
          if (!canConvert()) {
            set({ error: "오늘의 무료 변환 횟수를 모두 사용하셨습니다." });
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
              // 변환 성공 시 카운트 증가
              incrementConversionCount();

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
            // 개발 환경에서만 에러 로그 출력
            if (process.env.NODE_ENV === "development") {
              console.error("변환 오류:", error);
            }
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
          dailyConversionCount: state.dailyConversionCount,
          lastConversionDate: state.lastConversionDate,
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

// 변환 횟수 관련 셀렉터들
export const useDailyConversionCount = () =>
  useAppStore((state) => state.dailyConversionCount);
export const useMaxDailyConversions = () =>
  useAppStore((state) => state.maxDailyConversions);
export const useCanConvert = () => useAppStore((state) => state.canConvert());
