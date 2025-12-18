import * as React from 'react';
import { Input } from '@base-ui-components/react/input';
import { TextInputTheme, defaultTheme } from './theme';

// Simplified style type for web - we only need the properties we actually use
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

// Use a generic style type that's compatible with both RN and web
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

// Helper to flatten style arrays into a single object
function flattenStyle(style: StyleValue): WebViewStyle {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<WebViewStyle>((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style as WebViewStyle;
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

  // Convert style values to CSS-compatible format
  const toCssValue = (val: string | number | undefined): string | number | undefined => {
    if (val === undefined) return undefined;
    return val;
  };

  const baseStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    paddingLeft: toCssValue(paddingLeft) ?? '0.875rem',
    paddingRight: toCssValue(paddingRight) ?? '0.875rem',
    paddingTop: toCssValue(paddingTop),
    paddingBottom: toCssValue(paddingBottom),
    margin: 0,
    border: `${resolvedBorderWidth}px solid ${resolvedBorderColor}`,
    width: '100%',
    height: toCssValue(height) ?? theme.height,
    borderRadius: toCssValue(borderRadius) ?? theme.borderRadius,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    fontWeight: 'normal',
    backgroundColor: getColor(theme.backgroundColor, theme.backgroundColorDark, theme.disabledBackgroundColor, theme.disabledBackgroundColorDark),
    color: getColor(theme.color, theme.colorDark, theme.disabledColor, theme.disabledColorDark),
  };

  // Calculate line-based heights (assuming ~1.5em line height)
  const lineHeightEm = 1.5; // em units
  const hasAutoGrowLines = minLines !== undefined || maxLines !== undefined;
  const minHeight = minLines ? `${minLines * lineHeightEm}em` : (height ? undefined : '5rem');
  const maxHeight = maxLines ? `${maxLines * lineHeightEm}em` : undefined;

  const textareaStyle: React.CSSProperties = {
    ...baseStyle,
    height: toCssValue(height) ?? 'auto',
    minHeight: hasAutoGrowLines ? undefined : minHeight, // Auto-grow handles this via JS
    maxHeight: hasAutoGrowLines ? undefined : maxHeight,
    resize: hasAutoGrowLines ? 'none' : 'vertical',
    overflow: 'auto',
  };

  const focusColor = dark ? theme.focusColorDark : theme.focusColor;

  // Ref and state for auto-growing textarea
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = React.useState<number | undefined>(undefined);

  // Helper to calculate line heights in pixels
  const getLineHeightPx = React.useCallback((element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);
    let lineHeightPx = parseFloat(computedStyle.lineHeight);
    if (isNaN(lineHeightPx) || lineHeightPx === 0) {
      // Fallback: use font size * 1.5 if line-height is 'normal' or invalid
      const fontSize = parseFloat(computedStyle.fontSize) || 16;
      lineHeightPx = fontSize * 1.5;
    }
    return lineHeightPx;
  }, []);

  // Set initial height on mount for auto-grow textareas
  React.useLayoutEffect(() => {
    if (textareaRef.current && (minLines !== undefined || maxLines !== undefined)) {
      const textarea = textareaRef.current;
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeightPx = getLineHeightPx(textarea);
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
      const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;
      const extraHeight = paddingTop + paddingBottom + borderTop + borderBottom;

      const minPx = minLines ? (minLines * lineHeightPx + extraHeight) : 0;

      // Temporarily reset height to measure actual content
      const originalHeight = textarea.style.height;
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = originalHeight;

      setTextareaHeight(Math.max(scrollHeight, minPx));
    }
  }, [minLines, maxLines, getLineHeightPx]);

  // Auto-grow handler for textarea
  const handleTextareaChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeText?.(event.target.value);

      // Auto-grow logic
      if (minLines !== undefined || maxLines !== undefined) {
        const textarea = event.target;
        const computedStyle = window.getComputedStyle(textarea);
        const lineHeightPx = getLineHeightPx(textarea);
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
        const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
        const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;
        const extraHeight = paddingTop + paddingBottom + borderTop + borderBottom;

        const minPx = minLines ? (minLines * lineHeightPx + extraHeight) : 0;
        const maxPx = maxLines ? (maxLines * lineHeightPx + extraHeight) : Infinity;

        // Reset height to auto to get accurate scrollHeight
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;

        let newHeight = Math.max(scrollHeight, minPx);
        if (maxPx !== Infinity) {
          newHeight = Math.min(newHeight, maxPx);
        }

        // Apply the new height immediately to prevent flicker
        textarea.style.height = `${newHeight}px`;
        setTextareaHeight(newHeight);
      }
    },
    [onChangeText, minLines, maxLines, getLineHeightPx]
  );

  if (multiline) {
    const hasAutoGrow = minLines !== undefined || maxLines !== undefined;

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
          ...textareaStyle,
          height: hasAutoGrow ? (textareaHeight ?? minHeight) : textareaStyle.height,
          // Use 'auto' for overflow when maxLines is set (scrollbar appears when needed)
          // Use 'hidden' when only minLines is set (pure auto-grow, no max)
          overflow: hasAutoGrow ? (maxLines ? 'auto' : 'hidden') : 'auto',
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
