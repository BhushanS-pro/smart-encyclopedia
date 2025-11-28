import { useColorScheme } from '@/components/useColorScheme';
import { Pressable, StyleSheet, Text } from 'react-native';

interface CategoryChipProps {
  label?: string; // made optional to avoid crashes
  isActive?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ label = "Unknown", isActive = false, onPress }: CategoryChipProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formattedLabel = label?.toString()?.trim() || "Unknown";

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
        {formattedLabel.toUpperCase()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  chipLight: {
    backgroundColor: '#eef2ff',
    borderColor: '#cbd5e1',
  },
  chipDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#1e40af',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  labelLight: {
    color: '#1e293b',
  },
  labelDark: {
    color: '#f1f5f9',
  },
  labelActive: {
    color: '#ffffff',
  },
});
