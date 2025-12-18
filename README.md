# Universal Text Input

A cross-platform TextInput component for React Native and Web with consistent styling, theming, and auto-grow support.

## Features

- Works on iOS, Android, and Web
- Consistent styling across platforms
- Built-in dark mode support
- Customizable theming
- Auto-growing multiline inputs with `minLines`/`maxLines`
- Proper padding handling on all platforms

## Installation

```bash
npm install universal-text-input universal-text-input-expo
```

For Expo projects, you'll need to rebuild your native app after installing.

## Usage

### Basic Input

```tsx
import { TextInput } from 'universal-text-input';

function App() {
  const [value, setValue] = useState('');

  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder="Enter text..."
    />
  );
}
```

### Password Input

```tsx
<TextInput
  value={password}
  onChangeText={setPassword}
  placeholder="Enter password..."
  secureTextEntry
/>
```

### Multiline with Auto-Grow

```tsx
<TextInput
  value={text}
  onChangeText={setText}
  placeholder="Enter multiple lines..."
  multiline
  minLines={3}  // Start at 3 lines tall
  maxLines={6}  // Grow up to 6 lines, then scroll
/>
```

### Dark Mode

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  dark={isDarkMode}
/>
```

### Custom Styling

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  style={{
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 12,
  }}
/>
```

### Custom Theme

```tsx
import { TextInput, createTheme } from 'universal-text-input';

const customTheme = createTheme({
  backgroundColor: '#f0f9ff',
  borderColor: '#0ea5e9',
  focusColor: '#0284c7',
  borderRadius: 12,
});

<TextInput
  value={value}
  onChangeText={setValue}
  theme={customTheme}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled input value |
| `defaultValue` | `string` | - | Uncontrolled default value |
| `placeholder` | `string` | - | Placeholder text |
| `onChangeText` | `(text: string) => void` | - | Called when text changes |
| `onFocus` | `() => void` | - | Called when input gains focus |
| `onBlur` | `() => void` | - | Called when input loses focus |
| `style` | `StyleProp<ViewStyle>` | - | Style object (supports RN style arrays) |
| `editable` | `boolean` | `true` | Whether input is editable |
| `secureTextEntry` | `boolean` | `false` | Hide text (password input) |
| `multiline` | `boolean` | `false` | Allow multiple lines |
| `minLines` | `number` | - | Minimum lines for auto-grow textarea |
| `maxLines` | `number` | - | Maximum lines before scrolling |
| `autoFocus` | `boolean` | `false` | Auto-focus on mount |
| `dark` | `boolean` | `false` | Enable dark mode styling |
| `theme` | `TextInputTheme` | - | Custom theme overrides |

### Native-only Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `paddingHorizontal` | `number` | - | Horizontal padding (takes precedence over style) |
| `paddingVertical` | `number` | - | Vertical padding (takes precedence over style) |

### Web-only Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | CSS class name |

## Theme Properties

```typescript
interface TextInputTheme {
  backgroundColor?: string;
  backgroundColorDark?: string;
  borderColor?: string;
  borderColorDark?: string;
  borderRadius?: number;
  color?: string;
  colorDark?: string;
  placeholderColor?: string;
  placeholderColorDark?: string;
  focusColor?: string;
  focusColorDark?: string;
  fontSize?: number;
  height?: number;
  fontFamily?: string;
  disabledBackgroundColor?: string;
  disabledBackgroundColorDark?: string;
  disabledBorderColor?: string;
  disabledBorderColorDark?: string;
  disabledColor?: string;
  disabledColorDark?: string;
}
```

## Auto-Grow Behavior

When using `minLines` and/or `maxLines` with `multiline`:

- The textarea starts at `minLines` height
- As the user types, it grows to accommodate content
- Growth stops at `maxLines`, after which content scrolls
- If only `minLines` is set, the textarea grows indefinitely
- If only `maxLines` is set, it starts at 1 line and grows to max

## Platform Notes

### Android
- Uses a custom native view for proper padding and height calculation
- Content size changes are reported to JS for auto-grow behavior

### iOS
- Uses native UITextField/UITextView with proper padding support
- Height is managed by React Native layout system

### Web
- Uses native `<input>` and `<textarea>` elements
- Auto-grow uses `scrollHeight` measurement for accurate sizing

## License

MIT
