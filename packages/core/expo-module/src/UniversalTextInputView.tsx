import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface UniversalTextInputViewProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onContentSizeChange?: (event: { nativeEvent: { height: number } }) => void;
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

interface NativeProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (event: { nativeEvent: { text: string } }) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  onContentSizeChange?: (event: { nativeEvent: { height: number } }) => void;
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

const NativeView = requireNativeViewManager<NativeProps>('UniversalTextInput');

export function UniversalTextInputView({
  onChangeText,
  onFocus,
  onBlur,
  onContentSizeChange,
  ...props
}: UniversalTextInputViewProps) {
  const handleChangeText = React.useCallback(
    (event: { nativeEvent: { text: string } }) => {
      onChangeText?.(event.nativeEvent.text);
    },
    [onChangeText]
  );

  return (
    <NativeView
      {...props}
      onChangeText={handleChangeText}
      onInputFocus={onFocus}
      onInputBlur={onBlur}
      onContentSizeChange={onContentSizeChange}
    />
  );
}
