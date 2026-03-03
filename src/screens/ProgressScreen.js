import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ScreenHeader from '../components/screen-header';
import HistoryTab from '../components/history-tab';
import { useTheme } from '../hooks/use-theme';
import {
  CATEGORY_FILTERS,
  getFilteredExercises,
  getWorkoutGroups,
} from '../data/exercise-data-provider';
import { getProgressByMuscle, getCompletedWorkouts } from '../data/workout-history-storage';

const categoryLabels = CATEGORY_FILTERS.map((f) => f.label);
const PAGE_SIZE = 20;

const formatDate = (timestamp) => {
  const d = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
};

const ProgressScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [activeTab, setActiveTab] = useState('library');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [progressCards, setProgressCards] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  const workoutGroups = useMemo(() => {
    const filtered = getFilteredExercises(selectedCategory);
    return getWorkoutGroups(filtered);
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [counts, allCompleted] = await Promise.all([
          getProgressByMuscle(),
          getCompletedWorkouts(),
        ]);
        const allGroups = getWorkoutGroups(getFilteredExercises('All'));
        const cards = allGroups
          .filter((g) => counts[g.id])
          .map((g) => {
            const recentWorkout = allCompleted
              .filter((w) => w.muscle === g.id)
              .sort((a, b) => b.timestamp - a.timestamp)[0];
            return {
              id: g.id,
              completed: counts[g.id],
              total: g.exerciseCount,
              name: g.name,
              date: recentWorkout ? formatDate(recentWorkout.timestamp) : '',
            };
          });
        setProgressCards(cards);
        setCompletedWorkouts(allCompleted);
      })();
    }, [])
  );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const paginatedGroups = workoutGroups.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedGroups.length < workoutGroups.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader showBack title="" layout="progress" onBack={() => navigation.navigate('Main')} />

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'library' && styles.tabActive]}
          onPress={() => setActiveTab('library')}
        >
          <Text style={[styles.tabText, activeTab === 'library' && styles.tabTextActive]}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'history' ? (
        <HistoryTab completedWorkouts={completedWorkouts} />
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          {/* Progress Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progress</Text>
            {progressCards.length > 0 && (
              <TouchableOpacity onPress={() => setActiveTab('history')}>
                <Text style={styles.seeAllLink}>See All</Text>
              </TouchableOpacity>
            )}
          </View>

          {progressCards.length > 0 ? (
            <FlatList
              horizontal
              data={progressCards}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.progressCard}
                  onPress={() => navigation.navigate('WorkoutDetail', { muscle: item.id, completedCount: item.completed })}
                  activeOpacity={0.7}
                >
                  <Image source={require('../../Gold Medal.png')} style={styles.medalImage} />
                  <Text style={styles.progressName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.progressDate}>{item.date}</Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.progressCardsContainer}
            />
          ) : (
            <View style={styles.emptyProgress}>
              <Text style={styles.emptyProgressText}>Complete a workout to track progress!</Text>
            </View>
          )}

          {/* Categories */}
          <Text style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 12 }]}>Categories</Text>
          <FlatList
            horizontal
            data={categoryLabels}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryChip, selectedCategory === item && styles.categoryChipSelected]}
                onPress={() => handleCategoryChange(item)}
              >
                <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />

          {/* Workout Groups */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'Workouts' : `${selectedCategory} Workouts`}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>

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

          {hasMore && (
            <TouchableOpacity style={styles.loadMoreBtn} onPress={() => setPage((p) => p + 1)}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 40 },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: theme.colors.primary },
  tabText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  seeAllLink: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
  },
  progressCardsContainer: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 4 },
  progressCard: {
    width: 130,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  progressName: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  progressDate: {
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  emptyProgress: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyProgressText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted,
  },
  categoriesContainer: { paddingHorizontal: 20, paddingBottom: 20 },
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
  categoryTextSelected: { color: theme.colors.white },
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
  exerciseThumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  exerciseInfo: { flex: 1 },
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
  chevron: { fontSize: 28, color: theme.colors.primary },
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
