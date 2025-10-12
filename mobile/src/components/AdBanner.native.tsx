import Constants from "expo-constants";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const getAdUnitId = () => {
  if (__DEV__) {
    return TestIds.ADAPTIVE_BANNER;
  }

  return (
    Platform.select({
      ios:
        Constants.expoConfig?.extra?.admobIosBannerAdUnitId ||
        TestIds.ADAPTIVE_BANNER,
      android:
        Constants.expoConfig?.extra?.admobAndroidBannerAdUnitId ||
        TestIds.ADAPTIVE_BANNER,
    }) || TestIds.ADAPTIVE_BANNER
  );
};

export interface AdBannerProps {
  variant?: "banner" | "large" | "medium" | "full";
  style?: any;
}

export function AdBanner({ variant = "banner", style }: AdBannerProps) {
  const getBannerSize = () => {
    switch (variant) {
      case "large":
        return BannerAdSize.LARGE_BANNER;
      case "medium":
        return BannerAdSize.MEDIUM_RECTANGLE;
      case "full":
        return BannerAdSize.FULL_BANNER;
      default:
        return BannerAdSize.BANNER;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={getAdUnitId()}
        size={getBannerSize()}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log("AdMob 배너 광고 로드 완료");
        }}
        onAdFailedToLoad={(error) => {
          console.log("AdMob 배너 광고 로드 실패:", error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fb",
    paddingVertical: 10,
  },
});
