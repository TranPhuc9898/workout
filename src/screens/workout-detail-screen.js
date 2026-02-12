import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../theme';
import ScreenHeader from '../components/screen-header';
import ExpandableExerciseCard from '../components/expandable-exercise-card';
import {
  getExercisesByMuscle,
  getMuscleDisplayName,
} from '../data/exercise-data-provider';

const PAGE_SIZE = 20;

const WorkoutDetailScreen = ({ route, navigation }) => {
  const { muscle } = route.params;
  const allExercises = useMemo(() => getExercisesByMuscle(muscle), [muscle]);
  const title = getMuscleDisplayName(muscle);
  const [page, setPage] = useState(1);

  // Paginated slice
  const displayedExercises = allExercises.slice(0, page * PAGE_SIZE);
  const hasMore = displayedExercises.length < allExercises.length;

  const loadMore = () => {
    if (hasMore) setPage((p) => p + 1);
  };

  const renderExercise = ({ item, index }) => (
    <ExpandableExerciseCard item={item} index={index} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        showBack
        title={title}
        onBack={() => navigation.goBack()}
      />
      {/* Exercise list with pagination */}
      <FlatList
        data={displayedExercises}
        keyExtractor={(item, i) => `${item.name}-${i}`}
        renderItem={renderExercise}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <Text style={styles.loadingMore}>Loading more...</Text>
          ) : (
            <Text style={styles.endText}>
              All {allExercises.length} exercises loaded
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  loadingMore: {
    textAlign: 'center',
    padding: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  endText: {
    textAlign: 'center',
    padding: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
    fontSize: 12,
  },
});

export default WorkoutDetailScreen;
