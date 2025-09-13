import React from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = "변환할 텍스트를 입력하세요",
  disabled = false,
  rows = 4,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      // Ctrl+Enter로 변환 실행 (부모 컴포넌트에서 처리)
      e.preventDefault();
    }
  };

  return (
    <div className={`text-input-group ${className}`}>
      <label htmlFor="textInput" className="input-label">
        변환할 텍스트를 입력하세요
      </label>
      <textarea
        id="textInput"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="text-input"
        autoFocus
      />
      <div className="input-hint">
        💡 Ctrl+Enter를 눌러 빠르게 변환할 수 있습니다
      </div>
    </div>
  );
};
