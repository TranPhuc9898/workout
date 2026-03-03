// History tab - grid view of all completed workouts with medal icons
import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';

const formatDate = (timestamp) => {
  const d = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
};

const HistoryTab = ({ completedWorkouts }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (completedWorkouts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No completed workouts yet!</Text>
      </View>
    );
  }

  const sorted = [...completedWorkouts].sort((a, b) => b.timestamp - a.timestamp);

  const rows = [];
  for (let i = 0; i < sorted.length; i += 2) {
    rows.push(sorted.slice(i, i + 2));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Your Progress</Text>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, i) => (
            <TouchableOpacity
              key={`${item.muscle}-${item.timestamp}-${i}`}
              style={styles.card}
              onPress={() => navigation.navigate('SavedWorkoutDetail', { workout: item })}
              activeOpacity={0.7}
            >
              <Image source={require('../../Gold Medal.png')} style={styles.medalImage} />
              <Text style={styles.cardName} numberOfLines={2}>{item.customName || item.exerciseName}</Text>
              <Text style={styles.cardDate}>{formatDate(item.timestamp)}</Text>
            </TouchableOpacity>
          ))}
          {row.length === 1 && <View style={styles.cardEmpty} />}
        </View>
      ))}
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 20,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  cardEmpty: {
    width: '48%',
  },
  medalImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  cardName: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
  },
});

export default HistoryTab;
