import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppStore } from "../stores/appStore";
import { TextInput, ToneSelector, ResultDisplay, Button, Card, ErrorDisplay } from "../components";

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
    console.log("텍스트가 복사되었습니다:", text);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🎵 ToneTuner</Text>
        <Text style={styles.subtitle}>
          AI로 텍스트 톤을 자유롭게 변환하세요
        </Text>
      </View>

      <View style={styles.mainContent}>
        <Card>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="예: 안녕하세요, 오늘 날씨가 정말 좋네요!"
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
            disabled={isLoading || !inputText.trim()}
            loading={isLoading}
            icon="✨"
            testID="main-convert-button"
          />
        </Card>

        <ResultDisplay
          result={conversionResult}
          isLoading={isLoading}
          onCopy={handleCopy}
          testID="main-result-display"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          &copy; 2024 ToneTuner. AI로 더 나은 소통을 만들어가요.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    padding: 20,
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
});
