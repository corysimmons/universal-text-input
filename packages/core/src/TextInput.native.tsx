import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
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
}: TextInputProps) {
  return (
    <UniversalTextInputView
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      style={[{ width: '100%', height: multiline ? 100 : 44 }, style]}
      editable={editable}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      autoFocus={autoFocus}
      dark={dark}
    />
  );
}
