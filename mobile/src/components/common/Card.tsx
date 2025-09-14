import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { CardProps } from "../../types/ui";

export const Card: React.FC<CardProps> = ({
  children,
  padding = 16,
  margin = 0,
  borderRadius = 12,
  shadow = true,
  backgroundColor = "#fff",
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const cardStyle: ViewStyle = {
    padding,
    margin,
    borderRadius,
    backgroundColor,
    ...(shadow && styles.shadow),
  };

  return (
    <View
      style={cardStyle}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
