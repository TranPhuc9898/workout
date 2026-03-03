import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/use-theme';

const FREQUENCY_OPTIONS = [
  { label: '3 days/week', value: 3 },
  { label: '4 days/week', value: 4 },
  { label: '5 days/week', value: 5 },
];

const WorkoutBuddyScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [buddyName, setBuddyName] = useState('');
  const [frequency, setFrequency] = useState(3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          People are 65% more likely to stick to workouts with a buddy.{'\n'}
          If you skip a workout, we'll let your buddy know.
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bullet}>•  Get reminded when you miss</Text>
          <Text style={styles.bullet}>•  Celebrate streaks together</Text>
          <Text style={styles.bullet}>•  Stay consistent longer</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Who's your hype partner?"
          placeholderTextColor={theme.colors.textMuted}
          value={buddyName}
          onChangeText={setBuddyName}
        />

        <Text style={styles.frequencyTitle}>How often do you want to train?</Text>
        <View style={styles.frequencyRow}>
          {FREQUENCY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.freqOption, frequency === opt.value && styles.freqOptionSelected]}
              onPress={() => setFrequency(opt.value)}
            >
              <Text style={[styles.freqText, frequency === opt.value && styles.freqTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  description: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 22,
    marginBottom: 16,
  },
  bulletList: {
    marginBottom: 30,
    gap: 6,
  },
  bullet: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: 36,
  },
  frequencyTitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  frequencyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  freqOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  freqOptionSelected: {
    borderColor: theme.colors.primary,
  },
  freqText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  freqTextSelected: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.semiBold,
  },
});

export default WorkoutBuddyScreen;
