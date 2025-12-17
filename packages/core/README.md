# universal-text-input

A universal TextInput component for React Native (Expo) and Web with consistent styling and theming support.

## Installation

```bash
npm install universal-text-input
```

## Usage

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

### Uncontrolled Mode

For better performance, use `defaultValue` instead of `value`:

```tsx
<TextInput
  defaultValue="Initial text"
  onChangeText={(text) => console.log(text)}
/>
```

### Dark Mode

```tsx
<TextInput dark placeholder="Dark mode input" />
```

### Multiline

```tsx
<TextInput multiline placeholder="Enter multiple lines..." />
```

### Password Input

```tsx
<TextInput secureTextEntry placeholder="Password" />
```

### Disabled State

```tsx
<TextInput editable={false} value="Cannot edit" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled input value |
| `defaultValue` | `string` | - | Uncontrolled initial value |
| `placeholder` | `string` | - | Placeholder text |
| `onChangeText` | `(text: string) => void` | - | Called when text changes |
| `onFocus` | `() => void` | - | Called when input gains focus |
| `onBlur` | `() => void` | - | Called when input loses focus |
| `editable` | `boolean` | `true` | Whether input is editable |
| `secureTextEntry` | `boolean` | `false` | Masks text for passwords |
| `multiline` | `boolean` | `false` | Enables multiline input |
| `autoFocus` | `boolean` | `false` | Auto-focus on mount |
| `dark` | `boolean` | `false` | Enable dark mode styling |
| `theme` | `TextInputTheme` | - | Custom theme (web only) |
| `className` | `string` | - | CSS class name (web only) |
| `style` | `StyleProp<ViewStyle>` | - | Style prop (native only) |

## Theming (Web)

```tsx
import { TextInput, createTheme } from 'universal-text-input';

const customTheme = createTheme({
  borderRadius: 12,
  focusColor: '#8b5cf6',
  focusColorDark: '#a78bfa',
});

<TextInput theme={customTheme} placeholder="Custom themed" />
```

## License

MIT
