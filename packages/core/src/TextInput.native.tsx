import * as React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
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

  // Check if user provided valid height-related style (filter out 'auto' which isn't valid RN)
  const hasValidHeightStyle =
    (typeof flatStyle.height === 'number') ||
    (typeof flatStyle.minHeight === 'number') ||
    (typeof flatStyle.maxHeight === 'number') ||
    (typeof flatStyle.flex === 'number');

  // Filter out invalid height values like 'auto'
  const filteredStyle = { ...flatStyle };
  if (flatStyle.height === 'auto') {
    delete filteredStyle.height;
  }

  // Only apply default height if user hasn't specified valid height styling
  const defaultStyle = hasValidHeightStyle
    ? { width: '100%' as const }
    : { width: '100%' as const, height: multiline ? 100 : 44 };

  return (
    <UniversalTextInputView
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      style={[defaultStyle, filteredStyle]}
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
