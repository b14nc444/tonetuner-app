import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 플랫폼별 스토리지 유틸리티
 * React Native에서는 AsyncStorage를, 웹에서는 localStorage를 사용
 */
export class Storage {
  /**
   * 값을 저장합니다
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Storage setItem 오류:", error);
      throw error;
    }
  }

  /**
   * 값을 조회합니다
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Storage getItem 오류:", error);
      return null;
    }
  }

  /**
   * 값을 삭제합니다
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Storage removeItem 오류:", error);
      throw error;
    }
  }

  /**
   * 모든 키를 조회합니다
   */
  static async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error("Storage getAllKeys 오류:", error);
      return [];
    }
  }

  /**
   * 스토리지를 비웁니다
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Storage clear 오류:", error);
      throw error;
    }
  }
}

/**
 * 동기적 스토리지 (웹 환경에서만 사용)
 * React Native에서는 사용하지 않음
 */
export class SyncStorage {
  /**
   * 값을 저장합니다 (동기)
   */
  static setItem(key: string, value: string): void {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.error("SyncStorage setItem 오류:", error);
        throw error;
      }
    } else {
      console.warn("localStorage를 사용할 수 없는 환경입니다.");
    }
  }

  /**
   * 값을 조회합니다 (동기)
   */
  static getItem(key: string): string | null {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.error("SyncStorage getItem 오류:", error);
        return null;
      }
    } else {
      console.warn("localStorage를 사용할 수 없는 환경입니다.");
      return null;
    }
  }

  /**
   * 값을 삭제합니다 (동기)
   */
  static removeItem(key: string): void {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error("SyncStorage removeItem 오류:", error);
        throw error;
      }
    } else {
      console.warn("localStorage를 사용할 수 없는 환경입니다.");
    }
  }
}

