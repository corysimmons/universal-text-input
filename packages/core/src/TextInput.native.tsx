import * as React from 'react';
import { StyleProp, ViewStyle, StyleSheet, Platform } from 'react-native';
import { UniversalTextInputView } from 'universal-text-input-expo';

export interface TextInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: StyleProp<ViewStyle>;
  editable?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  dark?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

interface ContentSizeChangeEvent {
  nativeEvent: {
    height: number;
  };
}

const isAndroid = Platform.OS === 'android';

export function TextInput({
  value,
  defaultValue,
  placeholder,
  onChangeText,
  onFocus,
  onBlur,
  style,
  editable = true,
  secureTextEntry = false,
  multiline = false,
  autoFocus = false,
  dark = false,
  paddingHorizontal: paddingHorizontalProp,
  paddingVertical: paddingVerticalProp,
}: TextInputProps) {
  // Flatten style to extract padding values
  const flatStyle = StyleSheet.flatten(style) || {};

  // Extract padding from style, with prop values taking precedence
  const paddingHorizontal = paddingHorizontalProp ??
    (flatStyle.paddingHorizontal as number | undefined) ??
    (flatStyle.padding as number | undefined);
  const paddingVertical = paddingVerticalProp ??
    (flatStyle.paddingVertical as number | undefined) ??
    (flatStyle.padding as number | undefined);

  // Use auto height when explicitly set to 'auto', or when there's vertical padding and no explicit height
  // This ensures Android correctly accounts for padding in the height calculation
  // Multiline inputs should NOT auto-height - they have fixed height and scroll internally
  const hasExplicitHeight = flatStyle.height !== undefined && flatStyle.height !== 'auto';
  const hasAutoHeight = !multiline && !hasExplicitHeight && (flatStyle.height === 'auto' || paddingVertical !== undefined);

  // Track content size for Android auto-height
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);

  const handleContentSizeChange = React.useCallback((event: ContentSizeChangeEvent) => {
    if (isAndroid && hasAutoHeight) {
      const { height } = event.nativeEvent;
      setContentHeight(height);
    }
  }, [hasAutoHeight]);

  // On Android with auto height (single-line only), use the measured content height
  const androidHeightStyle = isAndroid && hasAutoHeight && contentHeight
    ? { height: contentHeight }
    : undefined;

  return (
    <UniversalTextInputView
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      onContentSizeChange={handleContentSizeChange}
      style={[{ width: '100%', height: multiline ? 100 : 44 }, style, androidHeightStyle]}
      editable={editable}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      autoFocus={autoFocus}
      dark={dark}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
    />
  );
}
