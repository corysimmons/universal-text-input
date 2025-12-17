# Universal Text Input

A cross-platform TextInput component for React Native (iOS/Android) and Web with consistent styling, theming support, and native performance.

## Features

- **Universal** - Works on iOS, Android, and Web with a single API
- **Native Performance** - Uses native text inputs on mobile (not WebView)
- **Theming** - Built-in light/dark mode support with customizable themes
- **Consistent API** - Same props work across all platforms
- **TypeScript** - Full TypeScript support with proper types

## Installation

```bash
npm install universal-text-input
```

### Expo Projects

After installing, run prebuild to generate native projects:

```bash
npx expo prebuild
```

## Usage

```tsx
import { TextInput } from 'universal-text-input';

function MyComponent() {
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

### Dark Mode

```tsx
import { TextInput } from 'universal-text-input';

function MyComponent() {
  const [value, setValue] = useState('');
  const isDark = useColorScheme() === 'dark';

  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder="Enter text..."
      dark={isDark}
    />
  );
}
```

### Multiline

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  placeholder="Enter multiple lines..."
  multiline
/>
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

### Disabled State

```tsx
<TextInput
  value="This input is disabled"
  editable={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The value of the text input |
| `onChangeText` | `(text: string) => void` | - | Callback when text changes |
| `placeholder` | `string` | - | Placeholder text |
| `onFocus` | `() => void` | - | Callback when input is focused |
| `onBlur` | `() => void` | - | Callback when input loses focus |
| `editable` | `boolean` | `true` | Whether the input is editable |
| `secureTextEntry` | `boolean` | `false` | Hide text for password input |
| `multiline` | `boolean` | `false` | Allow multiple lines of text |
| `autoFocus` | `boolean` | `false` | Auto-focus on mount |
| `dark` | `boolean` | `false` | Enable dark mode styling |
| `style` | `StyleProp<ViewStyle>` | - | Custom styles (native only) |
| `className` | `string` | - | CSS class name (web only) |
| `theme` | `TextInputTheme` | - | Custom theme overrides (web only) |

## Theming (Web)

You can customize the appearance by providing a custom theme:

```tsx
import { TextInput, createTheme } from 'universal-text-input';

const customTheme = createTheme({
  backgroundColor: '#f0f0f0',
  borderColor: '#ccc',
  borderRadius: 8,
  color: '#333',
  focusColor: '#007bff',
});

<TextInput
  value={value}
  onChangeText={setValue}
  theme={customTheme}
/>
```

### Theme Properties

| Property | Type | Description |
|----------|------|-------------|
| `backgroundColor` | `string` | Background color (light mode) |
| `backgroundColorDark` | `string` | Background color (dark mode) |
| `borderColor` | `string` | Border color (light mode) |
| `borderColorDark` | `string` | Border color (dark mode) |
| `borderRadius` | `number` | Border radius in pixels |
| `color` | `string` | Text color (light mode) |
| `colorDark` | `string` | Text color (dark mode) |
| `placeholderColor` | `string` | Placeholder color (light mode) |
| `placeholderColorDark` | `string` | Placeholder color (dark mode) |
| `focusColor` | `string` | Focus ring color (light mode) |
| `focusColorDark` | `string` | Focus ring color (dark mode) |
| `fontSize` | `number` | Font size in pixels |
| `height` | `number` | Input height in pixels |
| `fontFamily` | `string` | Font family |
| `disabledBackgroundColor` | `string` | Disabled background (light) |
| `disabledBackgroundColorDark` | `string` | Disabled background (dark) |
| `disabledBorderColor` | `string` | Disabled border (light) |
| `disabledBorderColorDark` | `string` | Disabled border (dark) |
| `disabledColor` | `string` | Disabled text color (light) |
| `disabledColorDark` | `string` | Disabled text color (dark) |

## Platform-Specific Behavior

### Web
- Uses `@base-ui-components/react` for the input component
- Supports `className` and `theme` props for styling
- Multiline uses native `<textarea>` element

### iOS
- Uses native `UITextField` for single-line input
- Uses native `UITextView` for multiline input
- Full native keyboard and input accessory support

### Android
- Uses native `EditText` component
- Full native keyboard support
- Proper text selection and clipboard support

## Requirements

- React 18.0.0 or higher
- For native: Expo SDK 54+ and React Native 0.81+
- For web: Any modern browser

## Packages

- **`universal-text-input`** - The main package (includes native module automatically)
- **`universal-text-input-expo`** - Native Expo module (installed as dependency, no need to install separately)

## License

MIT
