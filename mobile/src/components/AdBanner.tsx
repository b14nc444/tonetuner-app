export interface AdBannerProps {
  variant?: "banner" | "large" | "medium" | "full";
  style?: any;
}

// 웹 버전은 광고를 표시하지 않음
export function AdBanner({ variant = "banner", style }: AdBannerProps) {
  return null;
}
