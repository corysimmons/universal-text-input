import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface UniversalTextInputViewProps {
  value?: string;
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

interface NativeProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (event: { nativeEvent: { text: string } }) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  style?: StyleProp<ViewStyle>;
  editable?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  dark?: boolean;
}

const NativeView = requireNativeViewManager<NativeProps>('UniversalTextInput');

export function UniversalTextInputView({
  onChangeText,
  onFocus,
  onBlur,
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
    />
  );
}
