import * as React from 'react';
import { Input } from '@base-ui-components/react/input';
import { TextInputTheme, defaultTheme } from './theme';

export interface TextInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  editable?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  dark?: boolean;
  theme?: TextInputTheme;
}

export function TextInput({
  value,
  defaultValue,
  placeholder,
  onChangeText,
  onFocus,
  onBlur,
  className,
  editable = true,
  secureTextEntry = false,
  multiline = false,
  autoFocus = false,
  dark = false,
  theme: themeProp,
}: TextInputProps) {
  const theme = { ...defaultTheme, ...themeProp };

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChangeText?.(event.target.value);
    },
    [onChangeText]
  );

  const getColor = (lightColor: string | undefined, darkColor: string | undefined, disabledLight: string | undefined, disabledDark: string | undefined) => {
    if (!editable) {
      return dark ? disabledDark : disabledLight;
    }
    return dark ? darkColor : lightColor;
  };

  const baseStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    paddingLeft: '0.875rem',
    margin: 0,
    border: `1px solid ${getColor(theme.borderColor, theme.borderColorDark, theme.disabledBorderColor, theme.disabledBorderColorDark)}`,
    width: '100%',
    maxWidth: '16rem',
    height: theme.height,
    borderRadius: theme.borderRadius,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    fontWeight: 'normal',
    backgroundColor: getColor(theme.backgroundColor, theme.backgroundColorDark, theme.disabledBackgroundColor, theme.disabledBackgroundColorDark),
    color: getColor(theme.color, theme.colorDark, theme.disabledColor, theme.disabledColorDark),
  };

  const textareaStyle: React.CSSProperties = {
    ...baseStyle,
    height: 'auto',
    minHeight: '5rem',
    padding: '0.5rem 0.875rem',
    resize: 'vertical',
  };

  const focusColor = dark ? theme.focusColorDark : theme.focusColor;

  if (multiline) {
    return (
      <textarea
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={!editable}
        autoFocus={autoFocus}
        className={className}
        style={{
          ...textareaStyle,
          cursor: editable ? 'text' : 'not-allowed',
          // @ts-expect-error CSS custom property for focus style
          '--focus-color': focusColor,
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.outline = `1px solid ${focusColor}`;
          e.currentTarget.style.outlineOffset = '-1px';
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      />
    );
  }

  return (
    <Input
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={!editable}
      type={secureTextEntry ? 'password' : 'text'}
      autoFocus={autoFocus}
      className={className}
      style={{
        ...baseStyle,
        cursor: editable ? 'text' : 'not-allowed',
      }}
      onFocusCapture={(e) => {
        e.currentTarget.style.outline = `1px solid ${focusColor}`;
        e.currentTarget.style.outlineOffset = '-1px';
      }}
      onBlurCapture={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
    />
  );
}
