import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ErrorDisplayProps } from "../../types/ui";

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  variant = "error",
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const containerStyle = [
    styles.container,
    styles[variant],
  ];

  const iconStyle = [
    styles.icon,
    styles[`${variant}Icon`],
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
  ];

  const getIcon = () => {
    switch (variant) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "❌";
    }
  };

  return (
    <View
      style={containerStyle}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <Text style={iconStyle}>{getIcon()}</Text>
      <Text style={textStyle} numberOfLines={3}>
        {error}
      </Text>
      {onDismiss && (
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={onDismiss}
          accessibilityLabel="에러 메시지 닫기"
        >
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  error: {
    backgroundColor: "#f8d7da",
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  warning: {
    backgroundColor: "#fff3cd",
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  info: {
    backgroundColor: "#d1ecf1",
    borderLeftWidth: 4,
    borderLeftColor: "#17a2b8",
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorIcon: {
    color: "#721c24",
  },
  warningIcon: {
    color: "#856404",
  },
  infoIcon: {
    color: "#0c5460",
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: "#721c24",
  },
  warningText: {
    color: "#856404",
  },
  infoText: {
    color: "#0c5460",
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissText: {
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "bold",
  },
});
