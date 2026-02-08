---
phase: 03
title: "ProgressScreen Exercise Library Implementation"
status: pending
priority: P1
effort: 2-3h
created: 2026-02-03
---

# Phase 03: ProgressScreen Exercise Library Implementation

## Context

- **Parent Plan:** [plan.md](plan.md)
- **Previous Phase:** [Phase 01 - Setup](phase-01-setup-file-structure.md)
- **Design Reference:** `8.png` (Screen 08 - Progress/History)
- **Research:** [UI Analysis Report](../reports/ui-analysis-260203-0033-design-vs-implementation-gap.md) lines 198-241
- **React Native Patterns:** [Researcher 01](research/researcher-01-react-native-ui-patterns.md) lines 59-122

---

## Overview

**Date:** 2026-02-03
**Description:** Implement Screen 08 - Exercise library with progress cards, categories, exercise list
**Priority:** 🔴 Critical
**Status:** Pending
**Estimated time:** 2-3 hours

---

## Key Insights

1. Biggest gap in current implementation (screen missing entirely)
2. Requires 3 FlatLists: horizontal progress cards, horizontal categories, vertical exercises
3. FlatList optimization critical for smooth scrolling (getItemLayout, windowSize)
4. Exercise data hardcoded (from exercise-library-hardcoded.js in Phase 01)
5. Categories filter exercise list (simple array filter)
6. Navigation entry point: BottomSheet "Your History" button

---

## Requirements

### Functional
- Display progress cards (horizontal scroll)
- Display category chips (horizontal scroll, selectable)
- Display exercise list (vertical scroll)
- Filter exercises by selected category
- "See All" buttons (placeholder, no action for MVP)
- Navigate from BottomSheet to this screen

### Non-Functional
- Smooth scrolling (60fps on mid-range devices)
- FlatList optimization (getItemLayout, maxToRenderPerBatch)
- Match design pixel-perfect (8.png)
- Use hardcoded data (no API calls)

---

## Architecture

### Component Hierarchy
```
ProgressScreen
├── SafeAreaView (container)
├── ScrollView (main scroll)
│   ├── Header Row
│   │   ├── Text "Progress"
│   │   ├── Text "See All" (link)
│   │   └── Icon (notification bell)
│   ├── FlatList (horizontal - progress cards)
│   ├── FlatList (horizontal - category chips)
│   ├── Section Header
│   │   ├── Text "Abs Workout"
│   │   └── Text "See All" (link)
│   └── FlatList (vertical - exercise list)
└── BottomIndicatorBar
```

### Data Structure
```javascript
// Progress cards data
const progressCards = [
  {
    id: '1',
    name: 'Chest Workout',
    current: 5,
    total: 12,
    remainingMinutes: 15,
  },
  // ...more cards
];

// Categories (from exercise-library-hardcoded.js)
const categories = ['All', 'Warm Up', 'Yoga', 'Biceps', 'Chest', 'Abs', 'Legs'];

// Exercises (from exercise-library-hardcoded.js)
const exercises = [
  {
    id: 'abs-workout',
    name: 'Abs Workout',
    category: 'Abs',
    exercises: 16,
    duration: 18,
    thumbnail: require('../../assets/images/abs-thumbnail.png'),
  },
  // ...more exercises
];
```

---

## Related Code Files

### To Modify
- `src/screens/progress-screen-exercise-library.js` (replace boilerplate from Phase 01)

### To Create (Sub-components)
- `src/components/progress-card-horizontal-scroll.js` (progress card item)
- `src/components/category-chip-selectable-button.js` (category chip item)
- `src/components/exercise-list-item-with-thumbnail.js` (exercise row item)

### Dependencies
- `src/data/exercise-library-hardcoded.js` (from Phase 01)
- `src/components/bottom-indicator-bar.js` (from Phase 01)

---

## Implementation Steps

### Step 1: Expand Exercise Library Data

**Update exercise-library-hardcoded.js:**
```javascript
// src/data/exercise-library-hardcoded.js
export const EXERCISE_LIBRARY = [
  {
    id: 'abs-workout',
    name: 'Abs Workout',
    category: 'Abs',
    exercises: 16,
    duration: 18,
    caloriesPerRep: 0.3,
    thumbnail: require('../../assets/images/abs-thumbnail.png'),
    description: '16 Exercises • 18 Min',
  },
  {
    id: 'torso-trap-workout',
    name: 'Torso and Trap Workout',
    category: 'Chest',
    exercises: 12,
    duration: 20,
    caloriesPerRep: 0.5,
    thumbnail: require('../../assets/images/chest-thumbnail.png'),
    description: '12 Exercises • 20 Min',
  },
  {
    id: 'lower-back-exercise',
    name: 'Lower Back Exercise',
    category: 'Warm Up',
    exercises: 8,
    duration: 10,
    caloriesPerRep: 0.2,
    thumbnail: require('../../assets/images/back-thumbnail.png'),
    description: '8 Exercises • 10 Min',
  },
  // Add 10-15 more exercises across all categories
];

export const CATEGORIES = ['All', 'Warm Up', 'Yoga', 'Biceps', 'Chest', 'Abs', 'Legs'];

export const PROGRESS_CARDS = [
  { id: '1', name: 'Chest Workout', current: 5, total: 12, remainingMinutes: 15 },
  { id: '2', name: 'Legs Workout', current: 3, total: 20, remainingMinutes: 23 },
  { id: '3', name: 'Arms Workout', current: 8, total: 10, remainingMinutes: 5 },
];
```

---

### Step 2: Create Sub-Components

**2.1 ProgressCard Component:**
```javascript
// src/components/progress-card-horizontal-scroll.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressCard({ data }) {
  const progressPercentage = (data.current / data.total) * 100;

  return (
    <View style={styles.card}>
      {/* Circular progress indicator */}
      <View style={styles.progressCircle}>
        <Text style={styles.progressText}>
          {data.current}/{data.total}
        </Text>
      </View>

      {/* Workout info */}
      <Text style={styles.workoutName}>{data.name}</Text>
      <Text style={styles.remaining}>{data.remainingMinutes} min remaining</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Overpass-Bold',
    color: '#7C4DFF',
  },
  workoutName: {
    fontSize: 16,
    fontFamily: 'Overpass-Bold',
    color: '#000000',
  },
  remaining: {
    fontSize: 12,
    fontFamily: 'Overpass',
    color: '#81809E',
  },
});
```

**2.2 CategoryChip Component:**
```javascript
// src/components/category-chip-selectable-button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryChip({ label, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CFCFE2',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  chipSelected: {
    backgroundColor: '#7C4DFF',
    borderColor: '#7C4DFF',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Overpass',
    color: '#81809E',
  },
  textSelected: {
    color: '#FFFFFF',
    fontFamily: 'Overpass-Bold',
  },
});
```

**2.3 ExerciseListItem Component:**
```javascript
// src/components/exercise-list-item-with-thumbnail.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ExerciseListItem({ data, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      {/* Thumbnail */}
      <Image source={data.thumbnail} style={styles.thumbnail} resizeMode="cover" />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F6FB',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Overpass-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Overpass',
    color: '#81809E',
  },
  chevron: {
    fontSize: 28,
    color: '#CFCFE2',
    marginLeft: 8,
  },
});
```

---

### Step 3: Implement ProgressScreen Main Layout

**Full ProgressScreen implementation:**
```javascript
// src/screens/progress-screen-exercise-library.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { EXERCISE_LIBRARY, CATEGORIES, PROGRESS_CARDS } from '../data/exercise-library-hardcoded';
import ProgressCard from '../components/progress-card-horizontal-scroll';
import CategoryChip from '../components/category-chip-selectable-button';
import ExerciseListItem from '../components/exercise-list-item-with-thumbnail';
import BottomIndicatorBar from '../components/bottom-indicator-bar';

export default function ProgressScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter exercises by category
  const filteredExercises = selectedCategory === 'All'
    ? EXERCISE_LIBRARY
    : EXERCISE_LIBRARY.filter(ex => ex.category === selectedCategory);

  // Memoized render functions for FlatList optimization
  const renderProgressCard = useCallback(({ item }) => (
    <ProgressCard data={item} />
  ), []);

  const renderCategoryChip = useCallback(({ item }) => (
    <CategoryChip
      label={item}
      isSelected={item === selectedCategory}
      onPress={() => setSelectedCategory(item)}
    />
  ), [selectedCategory]);

  const renderExerciseItem = useCallback(({ item }) => (
    <ExerciseListItem
      data={item}
      onPress={() => {
        // Navigate to WorkoutScreen with selected exercise
        navigation.navigate('Workout', {
          workoutName: item.name,
          exercises: item.exercises,
        });
      }}
    />
  ), [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Cards (horizontal) */}
        <FlatList
          data={PROGRESS_CARDS}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderProgressCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.progressList}
          getItemLayout={(data, index) => ({
            length: 176, // card width 160 + margin 16
            offset: 176 * index,
            index,
          })}
          maxToRenderPerBatch={5}
          windowSize={3}
          removeClippedSubviews={true}
        />

        {/* Categories (horizontal) */}
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          maxToRenderPerBatch={7}
          windowSize={3}
        />

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Workouts' : `${selectedCategory} Workout`}
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Exercise List (vertical) */}
        <View style={styles.exerciseListContainer}>
          {filteredExercises.map((item) => (
            <ExerciseListItem
              key={item.id}
              data={item}
              onPress={() => {
                navigation.navigate('Workout', {
                  workoutName: item.name,
                  exercises: item.exercises,
                });
              }}
            />
          ))}
        </View>
      </ScrollView>

      <BottomIndicatorBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Overpass-Bold',
    color: '#000000',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Overpass',
    color: '#7C4DFF',
  },
  progressList: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Overpass-Bold',
    color: '#000000',
  },
  exerciseListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
```

---

### Step 4: Handle Missing Thumbnails

**Create placeholder images if thumbnails missing:**
```javascript
// Fallback for missing images
const placeholderThumbnail = {
  uri: 'https://via.placeholder.com/60x60/7C4DFF/FFFFFF?text=Ex',
};

// In exercise-library-hardcoded.js, use fallback:
thumbnail: require('../../assets/images/abs-thumbnail.png') || placeholderThumbnail,
```

---

### Step 5: Test ProgressScreen

**Manual testing:**
1. Navigate to ProgressScreen from BottomSheet
2. Verify progress cards scroll horizontally
3. Tap category chips → exercise list filters correctly
4. Scroll exercise list → smooth 60fps
5. Tap exercise item → navigates to WorkoutScreen
6. Test "See All" buttons (no action for MVP, no error)

**Performance testing:**
- [ ] Progress cards scroll smooth (no lag)
- [ ] Category selection feels instant
- [ ] Exercise list scrolls smooth with 15+ items
- [ ] No console warnings about FlatList keys

---

## Todo Checklist

- [ ] Expand exercise-library-hardcoded.js (15+ exercises, all categories)
- [ ] Create ProgressCard component
- [ ] Create CategoryChip component
- [ ] Create ExerciseListItem component
- [ ] Implement ProgressScreen main layout
- [ ] Add FlatList optimizations (getItemLayout, maxToRenderPerBatch)
- [ ] Test category filtering (All vs specific category)
- [ ] Test navigation to WorkoutScreen from exercise item
- [ ] Handle missing thumbnail images (fallback)
- [ ] Compare layout with 8.png (pixel-perfect check)
- [ ] Test scrolling performance (60fps target)

---

## Success Criteria

- ✅ ProgressScreen matches 8.png pixel-perfect
- ✅ 3 FlatLists scroll smoothly (horizontal + vertical)
- ✅ Category filtering works (All, Warm Up, Yoga, etc.)
- ✅ Exercise items navigate to WorkoutScreen
- ✅ 15+ exercises visible in library
- ✅ No console errors or FlatList warnings

---

## Risk Assessment

### Potential Issues
1. **FlatList performance lag with many items**
   - Mitigation: Use getItemLayout, maxToRenderPerBatch, removeClippedSubviews
2. **Nested FlatList + ScrollView conflicts**
   - Mitigation: Use map() for exercise list instead of FlatList (simpler)
3. **Missing thumbnail images**
   - Mitigation: Use placeholder images or solid color backgrounds
4. **Category filter re-renders entire screen**
   - Mitigation: Use useCallback for render functions

### Testing Strategy
- Test with 20+ exercises (realistic data load)
- Test rapid category switching (performance stress test)
- Test on low-end device (Android 6.0 emulator)

---

## Security Considerations

- No user input (no XSS risk)
- Hardcoded data only (no API injection risk)
- Image sources local (no remote URL vulnerabilities)

---

## Next Steps

**Dependencies for next phases:**
- Phase 04 (BottomSheet) needs navigation.navigate('Progress')
- Phase 06 (WorkoutScreen) needs params from exercise selection

**After completion:**
- User can browse exercise library
- Category filtering works
- Navigation from BottomSheet → ProgressScreen → WorkoutScreen complete
