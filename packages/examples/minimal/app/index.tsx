import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'universal-text-input';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [multilineText, setMultilineText] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.label, isDark && styles.labelDark]}>Basic Input</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Enter some text..."
          dark={isDark}
          style={{height:30, padding:200}}
        />
        <Text style={[styles.value, isDark && styles.valueDark]}>Value: {text}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, isDark && styles.labelDark]}>Password Input</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password..."
          secureTextEntry
          dark={isDark}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, isDark && styles.labelDark]}>Multiline Input</Text>
        <TextInput
          value={multilineText}
          onChangeText={setMultilineText}
          placeholder="Enter multiple lines..."
          multiline
          dark={isDark}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, isDark && styles.labelDark]}>Disabled Input</Text>
        <TextInput
          value="This input is disabled"
          editable={false}
          dark={isDark}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#171717',
  },
  labelDark: {
    color: '#fafafa',
  },
  value: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  valueDark: {
    color: '#a3a3a3',
  },
});
