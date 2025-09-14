// 모든 타입을 한 곳에서 export

export * from "./api";
export * from "./tone";

// 공통 타입들
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  currentScreen: "main" | "history" | "settings";
  isLoading: boolean;
  error: string | null;
}

// 유틸리티 타입들
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
