import React from "react";
import { Input } from "../common/Input";
import { InputProps } from "../../types/ui";

interface TextInputProps extends Omit<InputProps, "label" | "helperText"> {
  label?: string;
  helperText?: string;
  onKeyDown?: (e: any) => void; // React Native에서는 키보드 이벤트가 다름
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder = "변환할 텍스트를 입력하세요",
  disabled = false,
  multiline = true,
  numberOfLines = 4,
  label = "변환할 텍스트를 입력하세요",
  helperText = "💡 Ctrl+Enter를 눌러 빠르게 변환할 수 있습니다",
  onKeyDown,
  ...props
}) => {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      disabled={disabled}
      multiline={multiline}
      numberOfLines={numberOfLines}
      label={label}
      helperText={helperText}
      {...props}
    />
  );
};
