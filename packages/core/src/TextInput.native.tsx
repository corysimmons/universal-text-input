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
  minLines?: number;
  maxLines?: number;
  autoFocus?: boolean;
  dark?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

interface ContentSizeChangeEvent {
  nativeEvent: {
    height: number;
  };
  // Expo modules may also pass height directly
  height?: number;
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
  minLines,
  maxLines,
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

  // Use auto height when:
  // 1. Single-line with padding (to account for padding in height)
  // 2. Multiline with minLines/maxLines (auto-grow behavior)
  const hasExplicitHeight = flatStyle.height !== undefined && flatStyle.height !== 'auto';
  const hasAutoGrowMultiline = multiline && (minLines !== undefined || maxLines !== undefined);
  const hasAutoHeight = !hasExplicitHeight && (
    (!multiline && (flatStyle.height === 'auto' || paddingVertical !== undefined)) ||
    hasAutoGrowMultiline
  );

  // Track content size for Android auto-height
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);

  const handleContentSizeChange = React.useCallback((event: ContentSizeChangeEvent) => {
    if (isAndroid && hasAutoHeight) {
      // Handle both event structures: Expo modules may use nativeEvent or direct properties
      const height = event.nativeEvent?.height ?? event.height;
      if (height !== undefined && height > 0) {
        setContentHeight(height);
      }
    }
  }, [hasAutoHeight]);

  // Calculate min/max heights based on line count (approximate line height ~20dp + padding)
  const lineHeightDp = 20;
  const verticalPaddingDp = (paddingVertical ?? 0) * 2;
  const minHeightFromLines = minLines ? (minLines * lineHeightDp + verticalPaddingDp) : undefined;
  const maxHeightFromLines = maxLines ? (maxLines * lineHeightDp + verticalPaddingDp) : undefined;

  // On Android with auto height, use the measured content height (clamped for multiline)
  let androidHeightStyle: { height: number } | undefined;
  if (isAndroid && hasAutoHeight && contentHeight) {
    let height = contentHeight;
    if (hasAutoGrowMultiline) {
      if (minHeightFromLines) height = Math.max(height, minHeightFromLines);
      if (maxHeightFromLines) height = Math.min(height, maxHeightFromLines);
    }
    androidHeightStyle = { height };
  } else if (isAndroid && hasAutoGrowMultiline && minHeightFromLines) {
    // Set initial height to minLines before content size is reported
    androidHeightStyle = { height: minHeightFromLines };
  }

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
      minLines={minLines}
      maxLines={maxLines}
      autoFocus={autoFocus}
      dark={dark}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
    />
  );
}
