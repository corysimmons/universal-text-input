export interface TextInputTheme {
  backgroundColor?: string;
  backgroundColorDark?: string;
  borderColor?: string;
  borderColorDark?: string;
  borderRadius?: number;
  color?: string;
  colorDark?: string;
  placeholderColor?: string;
  placeholderColorDark?: string;
  focusColor?: string;
  focusColorDark?: string;
  fontSize?: number;
  height?: number;
  fontFamily?: string;
  // Disabled state colors
  disabledBackgroundColor?: string;
  disabledBackgroundColorDark?: string;
  disabledBorderColor?: string;
  disabledBorderColorDark?: string;
  disabledColor?: string;
  disabledColorDark?: string;
}

export const defaultTheme: TextInputTheme = {
  backgroundColor: '#ffffff',
  backgroundColorDark: '#171717',
  borderColor: '#d4d4d4',
  borderColorDark: '#404040',
  borderRadius: 6,
  color: '#171717',
  colorDark: '#fafafa',
  placeholderColor: '#a3a3a3',
  placeholderColorDark: '#a3a3a3',
  focusColor: '#3b82f6',
  focusColorDark: '#60a5fa',
  fontSize: 16,
  height: 40,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  // Disabled state colors
  disabledBackgroundColor: '#fafafa',
  disabledBackgroundColorDark: '#1a1a1a',
  disabledBorderColor: '#e5e5e5',
  disabledBorderColorDark: '#303030',
  disabledColor: '#a3a3a3',
  disabledColorDark: '#737373',
};

export function createTheme(overrides: Partial<TextInputTheme>): TextInputTheme {
  return { ...defaultTheme, ...overrides };
}
