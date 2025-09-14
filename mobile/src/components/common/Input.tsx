import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { InputProps } from "../../types/ui";

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoCorrect = true,
  maxLength,
  error,
  label,
  helperText,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const inputStyle = [
    styles.input,
    multiline && styles.multilineInput,
    error && styles.errorInput,
    !editable && styles.disabledInput,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6c757d"
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      />

      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#495057",
    backgroundColor: "#fff",
    minHeight: 44,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorInput: {
    borderColor: "#dc3545",
  },
  disabledInput: {
    backgroundColor: "#f8f9fa",
    color: "#6c757d",
  },
  helperText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#dc3545",
    marginTop: 4,
  },
});
