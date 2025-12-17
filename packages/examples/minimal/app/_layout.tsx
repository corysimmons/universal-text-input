import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function ThemeSwitcher() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Pressable onPress={toggleTheme} style={styles.themeButton}>
      {isDark ? (
        <Sun size={20} color="#F59E0B" />
      ) : (
        <Moon size={20} color="#6B7280" />
      )}
    </Pressable>
  );
}

function RootLayoutContent() {
  const { isDark } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#0a0a0a' : '#f5f5f5',
          },
          headerShadowVisible: false,
          headerTintColor: isDark ? '#fafafa' : '#171717',
          contentStyle: {
            backgroundColor: isDark ? '#0a0a0a' : '#f5f5f5',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Universal Text Input',
            headerRight: () => <ThemeSwitcher />,
          }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  themeButton: {
    padding: 8,
    marginRight: 8,
  },
});
