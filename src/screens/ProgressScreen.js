import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomIndicatorBar from '../components/BottomIndicatorBar';
import theme from '../theme';
import {
  CATEGORY_FILTERS,
  getFilteredExercises,
  getWorkoutGroups,
} from '../data/exercise-data-provider';

// Progress cards still hardcoded (no workout tracking backend yet)
const progressCards = [
  { id: '1', completed: 5, total: 12, name: 'Chest Workout', timeRemaining: '15 min remaining' },
  { id: '2', completed: 3, total: 20, name: 'Legs Workout', timeRemaining: '23 min remaining' },
  { id: '3', completed: 7, total: 15, name: 'Arms Workout', timeRemaining: '10 min remaining' },
];

const categoryLabels = CATEGORY_FILTERS.map((f) => f.label);

const PAGE_SIZE = 20;

const ProgressScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);

  // Filter exercises then group by primaryMuscles
  const workoutGroups = useMemo(() => {
    const filtered = getFilteredExercises(selectedCategory);
    return getWorkoutGroups(filtered);
  }, [selectedCategory]);

  // Reset page when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  // Paginated workout groups
  const paginatedGroups = workoutGroups.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedGroups.length < workoutGroups.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>See All</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Cards (Horizontal Scroll) */}
        <FlatList
          horizontal
          data={progressCards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.progressCard}>
              <Text style={styles.progressCount}>{item.completed}/{item.total}</Text>
              <Text style={styles.progressName}>{item.name}</Text>
              <Text style={styles.progressTime}>{item.timeRemaining}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressCardsContainer}
        />

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          horizontal
          data={categoryLabels}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipSelected
              ]}
              onPress={() => handleCategoryChange(item)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />

        {/* Workout Groups Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'Workouts' : `${selectedCategory} Workouts`}
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Workout Group Cards - grouped by primaryMuscles from exercises.json */}
        {paginatedGroups.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.exerciseCard}
            onPress={() => navigation.navigate('WorkoutDetail', { muscle: item.id })}
          >
            <Image
              source={item.gifUrl ? { uri: item.gifUrl } : require('../../assets/logo.png')}
              style={styles.exerciseThumbnail}
            />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseMeta}>
                {item.exerciseCount} Exercises  •  {item.duration}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Load more button */}
        {hasMore && (
          <TouchableOpacity style={styles.loadMoreBtn} onPress={() => setPage((p) => p + 1)}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}

        <BottomIndicatorBar />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  seeAllLink: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
  },
  notificationIcon: {
    fontSize: 20,
  },
  progressCardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressCard: {
    width: 150,
    height: 150,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCount: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  progressName: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  progressTime: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  categoryTextSelected: {
    color: theme.colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.backgroundSecondary,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
  },
  exerciseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  exerciseMeta: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  chevron: {
    fontSize: 28,
    color: theme.colors.primary,
  },
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  loadMoreText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
});

export default ProgressScreen;
