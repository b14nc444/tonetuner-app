import React from "react";
import { InputProps } from "../../types/ui";
import { Input } from "../common/Input";

interface TextInputProps extends Omit<InputProps, "label" | "helperText"> {
  label?: string;
  helperText?: string;
  disabled?: boolean; // disabled 속성 추가
  onKeyDown?: (e: any) => void; // React Native에서는 키보드 이벤트가 다름
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder = "변환할 텍스트를 입력하세요",
  disabled = false,
  multiline = true,
  numberOfLines = 6,
  label = "변환할 텍스트를 입력하세요",
  // helperText = "💡 Ctrl+Enter를 눌러 빠르게 변환할 수 있습니다",
  onKeyDown,
  ...props
}) => {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      editable={!disabled} // disabled를 editable로 변환
      multiline={multiline}
      numberOfLines={numberOfLines}
      label={label}
      // helperText={helperText}
      {...props}
    />
  );
};
