# Phase 05: ProgressScreen

## Design (8.png)
- Top: "Progress" title + "See All" link + notification icon
- Progress cards (horizontal scroll): 
  - "5/12" + "Chest Workout" + "15 min remaining"
  - "3/20" + "Legs Workout" + "23 min remaining"
- Category chips (horizontal scroll):
  - "All" (selected, purple)
  - "Warm Up", "Yoga", "Biceps", "Chest" (gray outline)
- "Abs Workout" section + "See All"
- Exercise list (vertical scroll):
  - Thumbnail + "Abs Workout" + "16 Exercises • 18 Min" + chevron
  - "Torso and Trap Workout"
  - "Lower Back Exercise"
- Bottom indicator bar

## Current Code
❌ NO ProgressScreen exists

## Changes Needed

### 1. Create `src/screens/ProgressScreen.js`

```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomIndicatorBar from '../components/BottomIndicatorBar';

// Hardcoded data (MVP - no backend)
const progressCards = [
  { id: '1', completed: 5, total: 12, name: 'Chest Workout', timeRemaining: '15 min remaining' },
  { id: '2', completed: 3, total: 20, name: 'Legs Workout', timeRemaining: '23 min remaining' },
  { id: '3', completed: 7, total: 15, name: 'Arms Workout', timeRemaining: '10 min remaining' },
];

const categories = ['All', 'Warm Up', 'Yoga', 'Biceps', 'Chest'];

const exercises = [
  { id: '1', name: 'Abs Workout', exercises: 16, duration: '18 Min', thumbnail: require('../../assets/exercise-abs.png') },
  { id: '2', name: 'Torso and Trap Workout', exercises: 8, duration: '10 Min', thumbnail: require('../../assets/exercise-torso.png') },
  { id: '3', name: 'Lower Back Exercise', exercises: 14, duration: '18 Min', thumbnail: require('../../assets/exercise-back.png') },
];

const ProgressScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

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
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(item)}
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

        {/* Abs Workout Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Abs Workout</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Exercise List */}
        {exercises.map((item) => (
          <TouchableOpacity key={item.id} style={styles.exerciseCard}>
            <Image source={item.thumbnail} style={styles.exerciseThumbnail} />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseMeta}>
                {item.exercises} Exercises • {item.duration}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        <BottomIndicatorBar />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontFamily: 'Overpass-Bold',
    color: '#000',
  },
  seeAllLink: {
    fontSize: 14,
    fontFamily: 'Overpass',
    color: '#7C4DFF',
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
    backgroundColor: '#F3F6FB',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCount: {
    fontSize: 24,
    fontFamily: 'Overpass-Bold',
    color: '#7C4DFF',
    marginBottom: 8,
  },
  progressName: {
    fontSize: 14,
    fontFamily: 'Overpass-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  progressTime: {
    fontSize: 12,
    fontFamily: 'Overpass',
    color: '#81809E',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Overpass-Bold',
    color: '#000',
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
    borderColor: '#CFCFE2',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#7C4DFF',
    borderColor: '#7C4DFF',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Overpass',
    color: '#81809E',
  },
  categoryTextSelected: {
    color: '#fff',
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
    backgroundColor: '#F3F6FB',
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
    fontFamily: 'Overpass-Bold',
    color: '#000',
    marginBottom: 4,
  },
  exerciseMeta: {
    fontSize: 12,
    fontFamily: 'Overpass',
    color: '#81809E',
  },
  chevron: {
    fontSize: 28,
    color: '#7C4DFF',
  },
});

export default ProgressScreen;
```

### 2. Update `App.js`
Add route:
```javascript
import ProgressScreen from './src/screens/ProgressScreen';

// In Stack.Navigator:
<Stack.Screen name="Progress" component={ProgressScreen} />
```

### 3. Create placeholder exercise images
```bash
# Use any placeholder images or solid colors for MVP
# exercise-abs.png, exercise-torso.png, exercise-back.png
```

## Success Criteria
- [x] ProgressScreen accessible from BottomSheet "Your History"
- [x] Progress cards scroll horizontally
- [x] Category chips scroll, "All" selected by default
- [x] Exercise list displays with thumbnails
- [x] Bottom indicator bar shows
- [x] Matches 8.png design

**Effort:** 2-3 hours
