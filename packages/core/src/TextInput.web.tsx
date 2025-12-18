import * as React from 'react';
import { Input } from '@base-ui-components/react/input';
import { TextInputTheme, defaultTheme } from './theme';

// Simplified style type for web - only properties we actually use
interface WebViewStyle {
  height?: string | number;
  padding?: string | number;
  paddingHorizontal?: string | number;
  paddingVertical?: string | number;
  paddingLeft?: string | number;
  paddingRight?: string | number;
  paddingTop?: string | number;
  paddingBottom?: string | number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: string | number;
}

type StyleValue = WebViewStyle | null | undefined | false | readonly StyleValue[];

export interface TextInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: StyleValue;
  className?: string;
  editable?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  minLines?: number;
  maxLines?: number;
  autoFocus?: boolean;
  dark?: boolean;
  theme?: TextInputTheme;
}

/** Flatten style arrays into a single object */
function flattenStyle(style: StyleValue): WebViewStyle {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<WebViewStyle>((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style as WebViewStyle;
}

/** Get line height in pixels from element's computed style */
function getLineHeightPx(element: HTMLElement): number {
  const computedStyle = window.getComputedStyle(element);
  const lineHeight = parseFloat(computedStyle.lineHeight);
  if (isNaN(lineHeight) || lineHeight === 0) {
    // Fallback for 'normal' line-height
    const fontSize = parseFloat(computedStyle.fontSize) || 16;
    return fontSize * 1.5;
  }
  return lineHeight;
}

/** Calculate auto-grow height bounds from computed style */
function getAutoGrowBounds(
  element: HTMLElement,
  minLines: number | undefined,
  maxLines: number | undefined
): { minPx: number; maxPx: number } {
  const computedStyle = window.getComputedStyle(element);
  const lineHeightPx = getLineHeightPx(element);
  // scrollHeight includes padding but not border, so only add padding here
  const verticalPadding =
    (parseFloat(computedStyle.paddingTop) || 0) +
    (parseFloat(computedStyle.paddingBottom) || 0);

  return {
    minPx: minLines ? minLines * lineHeightPx + verticalPadding : 0,
    maxPx: maxLines ? maxLines * lineHeightPx + verticalPadding : Infinity,
  };
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
  minLines,
  maxLines,
  autoFocus = false,
  dark = false,
  theme: themeProp,
}: TextInputProps) {
  // Memoize theme to avoid spreading on every render
  const theme = React.useMemo(
    () => (themeProp ? { ...defaultTheme, ...themeProp } : defaultTheme),
    [themeProp]
  );

  const flatStyle = flattenStyle(style);

  // Extract style properties
  const paddingHorizontal = flatStyle.paddingHorizontal ?? flatStyle.padding;
  const paddingVertical = flatStyle.paddingVertical ?? flatStyle.padding;

  // Memoize color resolver
  const getColor = React.useCallback(
    (light: string | undefined, dark_: string | undefined, disabledLight: string | undefined, disabledDark: string | undefined) =>
      !editable ? (dark ? disabledDark : disabledLight) : (dark ? dark_ : light),
    [editable, dark]
  );

  const focusColor = dark ? theme.focusColorDark : theme.focusColor;

  // Build base style object
  const baseStyle: React.CSSProperties = React.useMemo(() => ({
    boxSizing: 'border-box',
    paddingLeft: flatStyle.paddingLeft ?? paddingHorizontal ?? '0.875rem',
    paddingRight: flatStyle.paddingRight ?? paddingHorizontal ?? '0.875rem',
    paddingTop: flatStyle.paddingTop ?? paddingVertical,
    paddingBottom: flatStyle.paddingBottom ?? paddingVertical,
    margin: 0,
    border: `${flatStyle.borderWidth ?? 1}px solid ${flatStyle.borderColor ?? getColor(theme.borderColor, theme.borderColorDark, theme.disabledBorderColor, theme.disabledBorderColorDark)}`,
    width: '100%',
    height: flatStyle.height ?? theme.height,
    borderRadius: flatStyle.borderRadius ?? theme.borderRadius,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    fontWeight: 'normal',
    backgroundColor: getColor(theme.backgroundColor, theme.backgroundColorDark, theme.disabledBackgroundColor, theme.disabledBackgroundColorDark),
    color: getColor(theme.color, theme.colorDark, theme.disabledColor, theme.disabledColorDark),
  }), [flatStyle, paddingHorizontal, paddingVertical, theme, getColor]);

  // Focus handlers
  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLElement>) => {
    e.currentTarget.style.outline = `1px solid ${focusColor}`;
    e.currentTarget.style.outlineOffset = '-1px';
  }, [focusColor]);

  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLElement>) => {
    e.currentTarget.style.outline = 'none';
  }, []);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChangeText?.(event.target.value);
    },
    [onChangeText]
  );

  // Auto-grow textarea state
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = React.useState<number | undefined>(undefined);
  const hasAutoGrow = minLines !== undefined || maxLines !== undefined;

  // Set initial height on mount for auto-grow textareas
  React.useLayoutEffect(() => {
    if (!textareaRef.current || !hasAutoGrow) return;

    const textarea = textareaRef.current;
    const { minPx } = getAutoGrowBounds(textarea, minLines, maxLines);

    // Measure actual content height
    const originalHeight = textarea.style.height;
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = originalHeight;

    setTextareaHeight(Math.max(scrollHeight, minPx));
  }, [minLines, maxLines, hasAutoGrow]);

  // Auto-grow change handler
  const handleTextareaChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeText?.(event.target.value);

      if (!hasAutoGrow) return;

      const textarea = event.target;
      const { minPx, maxPx } = getAutoGrowBounds(textarea, minLines, maxLines);

      // Reset height to measure actual content
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;

      // Clamp height between min and max
      const newHeight = Math.min(Math.max(scrollHeight, minPx), maxPx);

      // Apply immediately to prevent flicker
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);
    },
    [onChangeText, minLines, maxLines, hasAutoGrow]
  );

  // Calculate CSS-based min/max heights for non-auto-grow textareas
  const lineHeightEm = 1.5;
  const cssMinHeight = minLines ? `${minLines * lineHeightEm}em` : (flatStyle.height ? undefined : '5rem');

  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={hasAutoGrow ? handleTextareaChange : handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={!editable}
        autoFocus={autoFocus}
        className={className}
        rows={hasAutoGrow ? undefined : minLines}
        style={{
          ...baseStyle,
          height: hasAutoGrow ? (textareaHeight ?? cssMinHeight) : (flatStyle.height ?? 'auto'),
          minHeight: hasAutoGrow ? undefined : cssMinHeight,
          maxHeight: hasAutoGrow ? undefined : (maxLines ? `${maxLines * lineHeightEm}em` : undefined),
          resize: hasAutoGrow ? 'none' : 'vertical',
          overflow: hasAutoGrow ? (maxLines ? 'auto' : 'hidden') : 'auto',
          cursor: editable ? 'text' : 'not-allowed',
        }}
        onFocusCapture={handleFocus}
        onBlurCapture={handleBlur}
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
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    />
  );
}
