import React from "react";
import { TONE_OPTIONS, ToneType } from "../types";

interface ToneSelectorProps {
  selectedTone: ToneType;
  onToneChange: (tone: ToneType) => void;
  disabled?: boolean;
  className?: string;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onToneChange,
  disabled = false,
  className = "",
}) => {
  const handleToneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tone = e.target.value as ToneType;
    onToneChange(tone);
  };

  return (
    <div className={`tone-selection ${className}`}>
      <label className="tone-label">변환할 톤을 선택하세요</label>
      <div className="tone-options">
        {TONE_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`tone-option ${disabled ? "disabled" : ""}`}>
            <input
              type="radio"
              name="tone"
              value={option.id}
              checked={selectedTone === option.id}
              onChange={handleToneChange}
              disabled={disabled}
            />
            <span className="tone-card">
              <span className="tone-icon">{option.icon}</span>
              <span className="tone-name">{option.name}</span>
              <span className="tone-desc">{option.description}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
