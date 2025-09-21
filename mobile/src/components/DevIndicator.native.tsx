import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getEnvironmentInfo } from "../services/config";

interface DevIndicatorProps {
  style?: any;
}

export const DevIndicator: React.FC<DevIndicatorProps> = ({ style = {} }) => {
  const envInfo = getEnvironmentInfo();

  // 개발 환경이 아니면 렌더링하지 않음
  if (!envInfo.isDevelopment) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>🔧 DEV</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 10,
    zIndex: 9999,
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ff5252",
    elevation: 5,
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
