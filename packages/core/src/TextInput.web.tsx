import * as React from 'react';
import { Input } from '@base-ui-components/react/input';
import { StyleProp, ViewStyle } from 'react-native';
import { TextInputTheme, defaultTheme } from './theme';

export interface TextInputProps {
  value?: string;
  defaultValue?: string;
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

// Helper to flatten StyleProp<ViewStyle> into a single object
function flattenStyle(style: StyleProp<ViewStyle>): ViewStyle {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<ViewStyle>((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style as ViewStyle;
}

export function TextInput({
  value,
  defaultValue,
  placeholder,
  onChangeText,
  onFocus,
  onBlur,
  style,
  className,
  editable = true,
  secureTextEntry = false,
  multiline = false,
  autoFocus = false,
  dark = false,
  theme: themeProp,
}: TextInputProps) {
  const theme = { ...defaultTheme, ...themeProp };
  const flatStyle = flattenStyle(style);

  // Extract relevant style properties
  const height = flatStyle.height;
  const paddingHorizontal = flatStyle.paddingHorizontal ?? flatStyle.padding;
  const paddingVertical = flatStyle.paddingVertical ?? flatStyle.padding;
  const paddingLeft = flatStyle.paddingLeft ?? paddingHorizontal;
  const paddingRight = flatStyle.paddingRight ?? paddingHorizontal;
  const paddingTop = flatStyle.paddingTop ?? paddingVertical;
  const paddingBottom = flatStyle.paddingBottom ?? paddingVertical;
  const borderWidth = flatStyle.borderWidth;
  const borderColor = flatStyle.borderColor;
  const borderRadius = flatStyle.borderRadius;

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

  const themeBorderColor = getColor(theme.borderColor, theme.borderColorDark, theme.disabledBorderColor, theme.disabledBorderColorDark);
  const resolvedBorderWidth = borderWidth ?? 1;
  const resolvedBorderColor = borderColor ?? themeBorderColor;

  const baseStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    paddingLeft: paddingLeft ?? '0.875rem',
    paddingRight: paddingRight ?? '0.875rem',
    paddingTop: paddingTop,
    paddingBottom: paddingBottom,
    margin: 0,
    border: `${resolvedBorderWidth}px solid ${resolvedBorderColor}`,
    width: '100%',
    height: height ?? theme.height,
    borderRadius: borderRadius ?? theme.borderRadius,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    fontWeight: 'normal',
    backgroundColor: getColor(theme.backgroundColor, theme.backgroundColorDark, theme.disabledBackgroundColor, theme.disabledBackgroundColorDark),
    color: getColor(theme.color, theme.colorDark, theme.disabledColor, theme.disabledColorDark),
  };

  const textareaStyle: React.CSSProperties = {
    ...baseStyle,
    height: height ?? 'auto',
    minHeight: height ? undefined : '5rem',
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
