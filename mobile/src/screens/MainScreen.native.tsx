import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppStore } from "../stores/appStore";

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
    Alert.alert("복사됨", "텍스트가 클립보드에 복사되었습니다.");
  };

  const tones = [
    { id: "formal", label: "정중한 톤" },
    { id: "casual", label: "친근한 톤" },
    { id: "professional", label: "전문적인 톤" },
    { id: "friendly", label: "친화적인 톤" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🎵 ToneTuner</Text>
        <Text style={styles.subtitle}>
          AI로 텍스트 톤을 자유롭게 변환하세요
        </Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="예: 안녕하세요, 오늘 날씨가 정말 좋네요!"
            multiline
            numberOfLines={4}
            editable={!isLoading}
          />

          <View style={styles.toneSelector}>
            <Text style={styles.toneLabel}>톤 선택:</Text>
            {tones.map((tone) => (
              <TouchableOpacity
                key={tone.id}
                style={[
                  styles.toneButton,
                  selectedTone === tone.id && styles.toneButtonSelected,
                ]}
                onPress={() => setSelectedTone(tone.id)}
                disabled={isLoading}>
                <Text
                  style={[
                    styles.toneButtonText,
                    selectedTone === tone.id && styles.toneButtonTextSelected,
                  ]}>
                  {tone.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.convertButton,
              (isLoading || !inputText.trim()) && styles.convertButtonDisabled,
            ]}
            onPress={handleConvert}
            disabled={isLoading || !inputText.trim()}>
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.convertButtonText}>변환 중...</Text>
              </>
            ) : (
              <>
                <Text style={styles.convertButtonText}>변환하기</Text>
                <Text style={styles.convertButtonIcon}>✨</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {conversionResult && (
          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>변환 결과:</Text>
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>{conversionResult}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopy(conversionResult)}>
                <Text style={styles.copyButtonText}>복사</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  inputSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 16,
    minHeight: 100,
  },
  toneSelector: {
    marginBottom: 16,
  },
  toneLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 12,
  },
  toneButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  toneButtonSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  toneButtonText: {
    fontSize: 14,
    color: "#495057",
    textAlign: "center",
  },
  toneButtonTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    color: "#721c24",
    fontSize: 14,
    flex: 1,
  },
  convertButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  convertButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  convertButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  convertButtonIcon: {
    fontSize: 16,
  },
  resultSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 12,
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  resultText: {
    flex: 1,
    fontSize: 16,
    color: "#495057",
    lineHeight: 24,
    marginRight: 12,
  },
  copyButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
