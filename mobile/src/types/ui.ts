// UI 컴포넌트 공통 타입 정의

export interface BaseComponentProps {
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  icon?: string;
  iconPosition?: "left" | "right";
}

export interface InputProps extends BaseComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  maxLength?: number;
  error?: string;
  label?: string;
  helperText?: string;
}

export interface CardProps extends BaseComponentProps {
  children: React.ReactNode;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  shadow?: boolean;
  backgroundColor?: string;
}

export interface LoadingProps extends BaseComponentProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
}

export interface ErrorDisplayProps extends BaseComponentProps {
  error: string;
  onDismiss?: () => void;
  variant?: "error" | "warning" | "info";
}

export interface ModalProps extends BaseComponentProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  animationType?: "slide" | "fade" | "none";
}

export interface ListItemProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export interface BadgeProps extends BaseComponentProps {
  text: string;
  color?: string;
  backgroundColor?: string;
  size?: "small" | "medium" | "large";
}

export interface DividerProps extends BaseComponentProps {
  color?: string;
  thickness?: number;
  orientation?: "horizontal" | "vertical";
}

// 스타일 관련 타입
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeTypography {
  h1: {
    fontSize: number;
    fontWeight: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    lineHeight: number;
  };
  h2: {
    fontSize: number;
    fontWeight: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    lineHeight: number;
  };
  h3: {
    fontSize: number;
    fontWeight: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    lineHeight: number;
  };
  body: {
    fontSize: number;
    fontWeight: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    lineHeight: number;
  };
  caption: {
    fontSize: number;
    fontWeight: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    lineHeight: number;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
  shadows: {
    small: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    medium: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    large: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}
