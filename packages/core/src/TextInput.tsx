// This file serves as the fallback and type definition
// The bundler will resolve to TextInput.web.tsx or TextInput.native.tsx
// based on the platform

import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { TextInputTheme } from './theme';

export interface TextInputProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
  editable?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  dark?: boolean;
  theme?: TextInputTheme;
}

// Default export - will be overridden by platform-specific versions
export function TextInput(_props: TextInputProps): React.ReactElement {
  throw new Error(
    'TextInput: No platform-specific implementation found. ' +
    'Make sure your bundler is configured to resolve .native.tsx and .web.tsx extensions.'
  );
}
