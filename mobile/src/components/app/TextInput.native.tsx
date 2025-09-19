import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { InputProps } from "../../types/ui";
import { Input } from "../common/Input";

interface TextInputProps extends Omit<InputProps, "label" | "helperText"> {
  label?: string;
  helperText?: string;
  disabled?: boolean; // disabled 속성 추가
  onKeyDown?: (e: any) => void; // React Native에서는 키보드 이벤트가 다름
  maxLength?: number; // 최대 글자 수 제한
}

const MAX_LENGTH = 1000;

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder = "변환할 텍스트를 입력하세요",
  disabled = false,
  multiline = true,
  numberOfLines = 6,
  label = "변환할 텍스트",
  maxLength = MAX_LENGTH,
  onKeyDown,
  ...props
}) => {
  const currentLength = value?.length || 0;
  const isNearLimit = currentLength >= 950;

  const handleTextChange = (text: string) => {
    // 최대 글자 수 제한
    if (text.length <= maxLength) {
      onChangeText?.(text);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        editable={!disabled} // disabled를 editable로 변환
        multiline={multiline}
        numberOfLines={numberOfLines}
        label={label}
        maxLength={maxLength}
        {...props}
      />

      <View style={styles.counterContainer}>
        <Text
          style={[
            styles.counterText,
            isNearLimit && styles.counterTextWarning,
          ]}>
          {currentLength} / {maxLength}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  counterContainer: {
    alignItems: "flex-end",
    marginTop: -8,
  },
  counterText: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
  },
  counterTextWarning: {
    color: "#dc3545",
    fontWeight: "600",
  },
});
