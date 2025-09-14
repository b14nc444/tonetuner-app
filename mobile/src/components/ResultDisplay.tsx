import React, { useState } from "react";
import { ToneConversionResponse } from "../types";

// TONE_OPTIONS import (컴포넌트 내에서 사용)
import { TONE_OPTIONS } from "../types";

interface ResultDisplayProps {
  result: ToneConversionResponse | null;
  isLoading?: boolean;
  onCopy?: (text: string) => void;
  className?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  isLoading = false,
  onCopy,
  className = "",
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    if (!result?.convertedText) return;

    try {
      await navigator.clipboard.writeText(result.convertedText);
      setCopySuccess(true);
      onCopy?.(result.convertedText);

      // 2초 후 복사 성공 상태 초기화
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("복사 실패:", error);
      // 폴백: 텍스트 선택
      const textArea = document.createElement("textarea");
      textArea.value = result.convertedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className={`result-section loading ${className}`}>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>텍스트를 변환하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className={`result-section ${className}`}>
      <div className="result-header">
        <h3>변환 결과</h3>
        <button
          onClick={handleCopy}
          className={`copy-btn ${copySuccess ? "success" : ""}`}
          disabled={!result.convertedText}>
          <span className="copy-icon">{copySuccess ? "✅" : "📋"}</span>
          {copySuccess ? "복사됨" : "복사"}
        </button>
      </div>

      <div className="result-content">
        <div className="result-meta">
          <span className="tone-badge">
            {TONE_OPTIONS.find((t) => t.id === result.tone)?.icon}
            {TONE_OPTIONS.find((t) => t.id === result.tone)?.name}
          </span>
          <span className="timestamp">
            {new Date(result.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="result-text">{result.convertedText}</div>

        {result.originalText !== result.convertedText && (
          <details className="original-text">
            <summary>원본 텍스트 보기</summary>
            <div className="original-content">{result.originalText}</div>
          </details>
        )}
      </div>
    </div>
  );
};
