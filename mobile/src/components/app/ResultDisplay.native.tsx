import React, { useState } from "react";
import { Clipboard, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  useDailyConversionCount,
  useMaxDailyConversions,
} from "../../stores/appStore";
import { TONE_OPTIONS, ToneConversionResponse } from "../../types/tone";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

interface ResultDisplayProps {
  result: ToneConversionResponse | null;
  isLoading?: boolean;
  onCopy?: (text: string) => void;
  testID?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  isLoading = false,
  onCopy,
  testID,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const dailyCount = useDailyConversionCount();
  const maxCount = useMaxDailyConversions();
  const isMaxReached = dailyCount >= maxCount;

  const handleCopy = async () => {
    if (!result?.convertedText) return;

    try {
      await Clipboard.setString(result.convertedText);
      setCopySuccess(true);
      onCopy?.(result.convertedText);
      Toast.show({
        type: "success",
        text1: "텍스트가 복사되었습니다.",
        position: "bottom",
        visibilityTime: 2000,
      });

      // 2초 후 복사 성공 상태 초기화
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      // 개발 환경에서만 에러 로그 출력
      if (process.env.NODE_ENV === "development") {
        console.error("복사 실패:", error);
      }
      Toast.show({
        type: "error",
        text1: "복사에 실패했습니다. 잠시 후 다시 시도해주세요.",
        position: "bottom",
        visibilityTime: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <Card testID={`${testID}-loading`}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>텍스트를 변환하고 있습니다...</Text>
        </View>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const toneOption = TONE_OPTIONS.find((t) => t.id === result.tone);

  return (
    <Card testID={testID}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>변환 결과</Text>
            {toneOption && (
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>{toneOption.icon}</Text>
                <Text style={styles.badgeText}>{toneOption.name}</Text>
              </View>
            )}
          </View>
          <View style={styles.usageContainer}>
            <Text
              style={[styles.usageText, isMaxReached && styles.usageTextMax]}>
              오늘 사용: {dailyCount}/{maxCount}회
            </Text>
          </View>
        </View>

        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result.convertedText}</Text>
        </View>

        <View style={styles.copyButtonContainer}>
          <Button
            title={copySuccess ? "복사됨" : "복사"}
            onPress={handleCopy}
            variant="outline"
            size="small"
            icon={copySuccess ? "✅" : "📋"}
            disabled={!result.convertedText}
            testID={`${testID}-copy-button`}
          />
        </View>

        {/* {result.originalText !== result.convertedText && (
          <View style={styles.originalContainer}>
            <Text style={styles.originalLabel}>원본 텍스트</Text>
            <Text style={styles.originalText}>{result.originalText}</Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>단어 수: {result.wordCount}개</Text>
          <Text style={styles.statsText}>
            처리 시간: {result.processingTime}ms
          </Text>
        </View> */}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#6c757d",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#495057",
    marginRight: 12,
  },
  copyButtonContainer: {
    alignItems: "flex-end",
    marginTop: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9ecef",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "500",
  },
  usageContainer: {
    alignItems: "center",
  },
  usageText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "500",
  },
  usageTextMax: {
    color: "#dc3545",
    fontWeight: "600",
  },
  resultContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    // marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    color: "#495057",
    lineHeight: 24,
  },
  originalContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingTop: 16,
    marginBottom: 16,
  },
  originalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c757d",
    marginBottom: 8,
  },
  originalText: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 20,
    fontStyle: "italic",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingTop: 12,
  },
  statsText: {
    fontSize: 12,
    color: "#6c757d",
  },
});
