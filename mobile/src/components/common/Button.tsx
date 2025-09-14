import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { ButtonProps } from "../../types/ui";

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#fff" : "#007bff"}
            style={styles.loadingIndicator}
          />
          <Text style={textStyle}>{title}</Text>
        </>
      );
    }

    if (icon) {
      return (
        <>
          {iconPosition === "left" && (
            <Text style={[styles.icon, textStyle]}>{icon}</Text>
          )}
          <Text style={textStyle}>{title}</Text>
          {iconPosition === "right" && (
            <Text style={[styles.icon, textStyle]}>{icon}</Text>
          )}
        </>
      );
    }

    return <Text style={textStyle}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button">
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
  },
  // Variants
  primary: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  secondary: {
    backgroundColor: "#6c757d",
    borderColor: "#6c757d",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#007bff",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 32,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  // States
  disabled: {
    opacity: 0.6,
  },
  // Text styles
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#fff",
  },
  outlineText: {
    color: "#007bff",
  },
  ghostText: {
    color: "#007bff",
  },
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.6,
  },
  // Icons
  icon: {
    marginHorizontal: 4,
  },
  loadingIndicator: {
    marginRight: 8,
  },
});
