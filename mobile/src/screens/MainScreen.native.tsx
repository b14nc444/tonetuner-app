import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  Button,
  Card,
  ErrorDisplay,
  ResultDisplay,
  TextInput,
  ToneSelector,
} from "../components";
import {
  useAppStore,
  useCanConvert,
  useDailyConversionCount,
  useMaxDailyConversions,
} from "../stores/appStore";

export const MainScreen: React.FC = () => {
  const {
    inputText,
    selectedTone,
    conversionResult,
    isLoading,
    error,
    setInputText,
    setSelectedTone,
    convertText,
    setError,
  } = useAppStore();

  const canConvert = useCanConvert();
  const dailyCount = useDailyConversionCount();
  const maxCount = useMaxDailyConversions();
  const isMaxReached = dailyCount >= maxCount;

  // 앱 시작 시 날짜 체크 및 카운트 리셋
  useEffect(() => {
    const { checkAndResetDailyCount } = useAppStore.getState();
    checkAndResetDailyCount();
  }, []);

  // 에러 메시지 자동 제거
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleConvert = async () => {
    await convertText();
  };

  const handleCopy = (text: string) => {
    // 텍스트 복사 로직 (필요시 Toast 메시지로 대체)
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>텍스트 톤 변환기</Text>
          <Text style={styles.subtitle}>
            AI로 텍스트 톤을 자유롭게 변환하세요
          </Text>
        </View>

        <View style={styles.mainContent}>
          <Card>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="여기에 텍스트를 입력하세요"
              disabled={isLoading}
              testID="main-text-input"
            />

            <ToneSelector
              selectedTone={selectedTone}
              onToneChange={setSelectedTone}
              disabled={isLoading}
              testID="main-tone-selector"
            />

            {error && (
              <ErrorDisplay
                error={error}
                onDismiss={() => setError(null)}
                testID="main-error-display"
              />
            )}

            <Button
              title="변환하기"
              onPress={handleConvert}
              disabled={isLoading || !inputText.trim() || !canConvert}
              loading={isLoading}
              icon="✨"
              testID="main-convert-button"
            />

            {isMaxReached && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  오늘의 변환 횟수를 모두 사용하셨습니다. 내일 다시
                  시도해주세요.
                </Text>
              </View>
            )}
          </Card>

          <View style={styles.spacer} />

          <ResultDisplay
            result={conversionResult}
            isLoading={isLoading}
            onCopy={handleCopy}
            testID="main-result-display"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            &copy; 2025 엎질. All rights reserved.
          </Text>
        </View>
      </ScrollView>
      <Toast
        config={{
          success: (props) => (
            <View style={styles.toastContainer}>
              <Text style={styles.toastText} numberOfLines={1}>
                {props.text1}
              </Text>
            </View>
          ),
          error: (props) => (
            <View style={styles.toastContainer}>
              <Text style={styles.toastText} numberOfLines={1}>
                {props.text1}
              </Text>
            </View>
          ),
          info: (props) => (
            <View style={styles.toastContainer}>
              <Text style={styles.toastText} numberOfLines={1}>
                {props.text1}
              </Text>
            </View>
          ),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1d1d1d",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: "#6a6a6a",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  spacer: {
    height: 20,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  footerText: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
  },
  toastContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    alignSelf: "center",
    maxWidth: "90%",
  },
  toastText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  warningContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },
});
