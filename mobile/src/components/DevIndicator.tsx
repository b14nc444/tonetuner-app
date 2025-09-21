import React from "react";
import { getEnvironmentInfo } from "../services/config";

interface DevIndicatorProps {
  className?: string;
  style?: React.CSSProperties;
}

export const DevIndicator: React.FC<DevIndicatorProps> = ({
  className = "",
  style = {},
}) => {
  const envInfo = getEnvironmentInfo();

  // 개발 환경이 아니면 렌더링하지 않음
  if (!envInfo.isDevelopment) {
    return null;
  }

  return (
    <div
      className={`dev-indicator ${className}`}
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 9999,
        backgroundColor: "#ff6b6b",
        color: "white",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        border: "2px solid #ff5252",
        ...style,
      }}
      title={`개발 환경 - Debug: ${envInfo.debug}, Logging: ${envInfo.enableLogging}`}>
      🔧 DEV
    </div>
  );
};
