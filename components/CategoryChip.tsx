import { Pressable, StyleSheet, Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';

interface CategoryChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ label, isActive = false, onPress }: CategoryChipProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      style={[
        styles.chip,
        isDark ? styles.chipDark : styles.chipLight,
        isActive ? styles.chipActive : null,
      ]}
    >
      <Text
        style={[
          styles.label,
          isDark ? styles.labelDark : styles.labelLight,
          isActive ? styles.labelActive : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    marginBottom: 12,
  },
  chipLight: {
    backgroundColor: '#e2e8f0',
  },
  chipDark: {
    backgroundColor: '#1f2937',
  },
  chipActive: {
    backgroundColor: '#2563eb',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelLight: {
    color: '#1f2937',
  },
  labelDark: {
    color: '#f8fafc',
  },
  labelActive: {
    color: '#ffffff',
  },
});
