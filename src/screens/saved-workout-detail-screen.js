// Screen to display saved workout details when tapping a history card
import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/use-theme';
import ScreenHeader from '../components/screen-header';

const formatFullDate = (timestamp) => {
  const d = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const SavedWorkoutDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { workout } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        showBack
        layout="progress"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Image source={require('../../Gold Medal.png')} style={styles.medalImage} />
        <Text style={styles.workoutName}>{workout.customName || workout.exerciseName}</Text>
        <Text style={styles.date}>{formatFullDate(workout.timestamp)}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{workout.totalReps || 0}</Text>
            <Text style={styles.statLabel}>Total Reps</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{workout.calories || 0}</Text>
            <Text style={styles.statLabel}>Calories Burnt</Text>
          </View>
        </View>

        {workout.muscle && workout.muscle !== 'general' && (
          <View style={styles.muscleTag}>
            <Text style={styles.muscleTagText}>{workout.muscle}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  medalImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginBottom: 32,
  },
  statsContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  muscleTag: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  muscleTagText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

export default SavedWorkoutDetailScreen;
