import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  placeholder = 'Search encyclopedic knowledge...',
  onChangeText,
  onSubmit,
  onClear,
  autoFocus,
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <FontAwesome name="search" size={18} color={isDark ? '#cbd5f5' : '#52616b'} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: isDark ? '#f8fafc' : '#1f2937' }]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCorrect={false}
        autoCapitalize="none"
        autoFocus={autoFocus}
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={onClear}
          style={styles.clearButton}
        >
          <FontAwesome name="close" size={16} color={isDark ? '#cbd5f5' : '#64748b'} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 12, default: 10 }),
    marginBottom: 16,
  },
  containerLight: {
    backgroundColor: '#f1f5f9',
  },
  containerDark: {
    backgroundColor: '#1f2a37',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 12,
  },
});
