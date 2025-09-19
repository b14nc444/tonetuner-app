import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TONE_OPTIONS, ToneType } from "../../types/tone";

interface ToneSelectorProps {
  selectedTone: ToneType;
  onToneChange: (tone: ToneType) => void;
  disabled?: boolean;
  testID?: string;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onToneChange,
  disabled = false,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.label}>변환할 톤 선택</Text>
      <View style={styles.gridContainer}>
        {TONE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selectedTone === option.id && styles.selectedOption,
              disabled && styles.disabledOption,
            ]}
            onPress={() => onToneChange(option.id)}
            disabled={disabled}
            accessibilityLabel={`${option.name} 선택`}
            accessibilityRole="button"
            accessibilityState={{
              selected: selectedTone === option.id,
              disabled,
            }}>
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text
              style={[
                styles.optionName,
                selectedTone === option.id && styles.selectedOptionName,
              ]}>
              {option.name}
            </Text>
            <Text
              style={[
                styles.optionDescription,
                selectedTone === option.id && styles.selectedOptionDescription,
              ]}>
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  option: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e9ecef",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    elevation: 2,
    minHeight: 100,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: "#007bff",
    backgroundColor: "#f8f9ff",
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    textAlign: "center",
    marginBottom: 4,
  },
  selectedOptionName: {
    color: "#007bff",
  },
  optionDescription: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 16,
  },
  selectedOptionDescription: {
    color: "#007bff",
  },
});
