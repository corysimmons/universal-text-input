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
  nativeEvent?: { height: number };
  height?: number;
}

const isAndroid = Platform.OS === 'android';
const LINE_HEIGHT_DP = 20;

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
  const flatStyle = StyleSheet.flatten(style) || {};

  // Extract padding (props take precedence over style)
  const paddingHorizontal = paddingHorizontalProp ??
    (flatStyle.paddingHorizontal as number | undefined) ??
    (flatStyle.padding as number | undefined);
  const paddingVertical = paddingVerticalProp ??
    (flatStyle.paddingVertical as number | undefined) ??
    (flatStyle.padding as number | undefined);

  // Determine if auto-height is needed
  const hasExplicitHeight = flatStyle.height !== undefined && flatStyle.height !== 'auto';
  const hasAutoGrowMultiline = multiline && (minLines !== undefined || maxLines !== undefined);
  const hasAutoHeight = !hasExplicitHeight && (
    (!multiline && (flatStyle.height === 'auto' || paddingVertical !== undefined)) ||
    hasAutoGrowMultiline
  );

  // Track content height for Android auto-grow
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);

  const handleContentSizeChange = React.useCallback((event: ContentSizeChangeEvent) => {
    if (!isAndroid || !hasAutoHeight) return;
    const height = event.nativeEvent?.height ?? event.height;
    if (height && height > 0) {
      setContentHeight(height);
    }
  }, [hasAutoHeight]);

  // Calculate height bounds for auto-grow
  const verticalPaddingDp = (paddingVertical ?? 0) * 2;
  const minHeightFromLines = minLines ? minLines * LINE_HEIGHT_DP + verticalPaddingDp : undefined;
  const maxHeightFromLines = maxLines ? maxLines * LINE_HEIGHT_DP + verticalPaddingDp : undefined;

  // Compute Android height style
  const androidHeightStyle = React.useMemo(() => {
    if (!isAndroid) return undefined;

    if (hasAutoHeight && contentHeight) {
      let height = contentHeight;
      if (hasAutoGrowMultiline) {
        if (minHeightFromLines) height = Math.max(height, minHeightFromLines);
        if (maxHeightFromLines) height = Math.min(height, maxHeightFromLines);
      }
      return { height };
    }

    if (hasAutoGrowMultiline && minHeightFromLines) {
      return { height: minHeightFromLines };
    }

    return undefined;
  }, [contentHeight, hasAutoHeight, hasAutoGrowMultiline, minHeightFromLines, maxHeightFromLines]);

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
