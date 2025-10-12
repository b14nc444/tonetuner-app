import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";
import { MainScreen } from "./src/screens/MainScreen.native";

export default function App() {
  useEffect(() => {
    // AdMob 초기화
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log("AdMob 초기화 완료:", adapterStatuses);
      })
      .catch((error) => {
        console.error("AdMob 초기화 실패:", error);
      });
  }, []);

  return (
    <>
      <MainScreen />
      <StatusBar style="auto" />
    </>
  );
}
