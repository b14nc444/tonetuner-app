import React, { useEffect } from "react";
import { DevIndicator } from "../components/DevIndicator";
import { ResultDisplay } from "../components/ResultDisplay";
import { TextInput } from "../components/TextInput";
import { ToneSelector } from "../components/ToneSelector";
import { useAppStore } from "../stores/appStore";

export const MainScreen: React.FC = () => {
  const {
    inputText,
    selectedTone,
    conversionResult,
    isLoading,
    error,
    setInputText,
    setSelectedTone,
    convertText,
    setError,
  } = useAppStore();

  // 에러 메시지 자동 제거
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleConvert = async () => {
    await convertText();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleConvert();
    }
  };

  const handleCopy = (text: string) => {
    // 텍스트 복사 로직 (필요시 Toast 메시지로 대체)
  };

  return (
    <div className="main-screen" onKeyDown={handleKeyDown}>
      <DevIndicator />
      <header className="header">
        <h1 className="logo">🎵 ToneTuner</h1>
        <p className="subtitle">AI로 텍스트 톤을 자유롭게 변환하세요</p>
      </header>

      <main className="main-content">
        <div className="input-section">
          <TextInput
            value={inputText}
            onChange={setInputText}
            placeholder="예: 안녕하세요, 오늘 날씨가 정말 좋네요!"
            disabled={isLoading}
          />

          <ToneSelector
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
            disabled={isLoading}
          />

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={isLoading || !inputText.trim()}
            className="convert-btn">
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                변환 중...
              </>
            ) : (
              <>
                <span className="btn-text">변환하기</span>
                <span className="btn-icon">✨</span>
              </>
            )}
          </button>
        </div>

        <ResultDisplay
          result={conversionResult}
          isLoading={isLoading}
          onCopy={handleCopy}
        />
      </main>

      <footer className="footer">
        <p>&copy; 2024 ToneTuner. AI로 더 나은 소통을 만들어가요.</p>
      </footer>
    </div>
  );
};
