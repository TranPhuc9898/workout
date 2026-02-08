---
phase: 01
title: "Setup & File Structure"
status: pending
priority: P1
effort: 30min
created: 2026-02-03
---

# Phase 01: Setup & File Structure

## Context

- **Parent Plan:** [plan.md](plan.md)
- **Research:** [UI Analysis Report](../reports/ui-analysis-260203-0033-design-vs-implementation-gap.md)
- **Dependencies:** None (first phase)

---

## Overview

**Date:** 2026-02-03
**Description:** Create new file structure, update App.js navigation routes
**Priority:** 🔴 Critical
**Status:** Pending
**Estimated time:** 30 minutes

---

## Key Insights

1. App.js uses React Navigation Stack (already configured)
2. Need 2 new screens: IntroScreen.js, ProgressScreen.js
3. Need 1 new component: BottomIndicatorBar.js
4. Need 2 data/utility files: exercise-library.js, workout-calculator.js
5. Current navigation: Main → Settings → Workout (no initial route set)

---

## Requirements

### Functional
- Create 2 new screen files with boilerplate
- Create 1 new component file
- Create 2 data/utility files
- Update App.js Stack.Navigator with new routes
- Set IntroScreen as initialRouteName

### Non-Functional
- Follow existing code style (StyleSheet, functional components)
- Use existing fonts (Overpass, Overpass-Bold)
- Use existing colors (#7C4DFF purple, #F3F6FB gray)
- Keep files under 200 lines per development rules

---

## Architecture

### File Structure (After Phase 01)
```
src/
├── components/
│   ├── AnimatedBubble.js           (exists)
│   ├── CircularProgressBar.js      (exists)
│   ├── HorizontalProgressBar.js    (exists)
│   ├── BottomSheet.js              (exists)
│   ├── Progress.js                 (exists)
│   └── bottom-indicator-bar.js     (NEW - decorative bar)
├── data/
│   └── exercise-library-hardcoded.js (NEW - exercise data)
├── services/
│   └── workout-calorie-calculator.js (NEW - calorie formulas)
├── screens/
│   ├── MainScreen.js               (exists)
│   ├── SettingsScreen.js           (exists)
│   ├── WorkoutScreen.js            (exists)
│   ├── intro-screen-coach-greeting.js (NEW - Screen 01)
│   └── progress-screen-exercise-library.js (NEW - Screen 08)
└── SettingsContext.js              (exists)
```

### Navigation Flow (After Update)
```
IntroScreen (initial) → "Start" button
  ↓
MainScreen → "Tap to start"
  ↓
WorkoutScreen (active workout)
  ↓
BottomSheet Modal (completion)
  ├→ "Next Exercise" → WorkoutScreen (new instance)
  └→ "Your History" → ProgressScreen
```

---

## Related Code Files

### To Modify
- `App.js` (add routes, set initialRouteName)

### To Create
- `src/screens/intro-screen-coach-greeting.js`
- `src/screens/progress-screen-exercise-library.js`
- `src/components/bottom-indicator-bar.js`
- `src/data/exercise-library-hardcoded.js`
- `src/services/workout-calorie-calculator.js`

---

## Implementation Steps

### Step 1: Create Data Files

**1.1 Create exercise library file**
```javascript
// src/data/exercise-library-hardcoded.js
export const EXERCISE_LIBRARY = [
  {
    id: 'abs-workout',
    name: 'Abs Workout',
    category: 'Abs',
    exercises: 16,
    duration: 18, // minutes
    caloriesPerRep: 0.3,
    thumbnail: require('../../assets/images/exercise-placeholder.png'),
  },
  // Add 10-15 more exercises
];

export const CATEGORIES = ['All', 'Warm Up', 'Yoga', 'Biceps', 'Chest', 'Abs', 'Legs'];
```

**1.2 Create calorie calculator**
```javascript
// src/services/workout-calorie-calculator.js
export const calculateCalories = (totalReps, exerciseType = 'mixed') => {
  const caloriesPerRep = 0.5; // Simple MVP formula
  return Math.round(totalReps * caloriesPerRep * 10) / 10;
};
```

---

### Step 2: Create Component Files

**2.1 BottomIndicatorBar component**
```javascript
// src/components/bottom-indicator-bar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function BottomIndicatorBar() {
  return <View style={styles.indicator} />;
}

const styles = StyleSheet.create({
  indicator: {
    width: 110,
    height: 5,
    backgroundColor: '#7C4DFF',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 24,
  },
});
```

---

### Step 3: Create Screen Files (Boilerplate)

**3.1 IntroScreen boilerplate**
```javascript
// src/screens/intro-screen-coach-greeting.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function IntroScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>IntroScreen Placeholder</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Overpass-Bold',
  },
});
```

**3.2 ProgressScreen boilerplate**
```javascript
// src/screens/progress-screen-exercise-library.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ProgressScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ProgressScreen Placeholder</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Overpass-Bold',
  },
});
```

---

### Step 4: Update App.js Navigation

**4.1 Add imports**
```javascript
import IntroScreen from './src/screens/intro-screen-coach-greeting';
import ProgressScreen from './src/screens/progress-screen-exercise-library';
```

**4.2 Update Stack.Navigator**
```javascript
<Stack.Navigator
  screenOptions={{ headerShown: false }}
  initialRouteName="Intro"  // NEW: Set IntroScreen as first screen
>
  <Stack.Screen name="Intro" component={IntroScreen} />
  <Stack.Screen name="Main" component={MainScreen} />
  <Stack.Screen name="Settings" component={SettingsScreen} />
  <Stack.Screen name="Workout" component={WorkoutScreen} />
  <Stack.Screen name="Progress" component={ProgressScreen} />
</Stack.Navigator>
```

---

### Step 5: Test Navigation

**5.1 Run app and verify:**
- IntroScreen shows first (placeholder text)
- No navigation errors in console
- Can manually navigate between screens (temporarily add buttons)

---

## Todo Checklist

- [ ] Create `src/data/` directory
- [ ] Create `src/services/` directory
- [ ] Write `exercise-library-hardcoded.js` with 10+ exercises
- [ ] Write `workout-calorie-calculator.js` with simple formula
- [ ] Write `bottom-indicator-bar.js` component
- [ ] Write `intro-screen-coach-greeting.js` boilerplate
- [ ] Write `progress-screen-exercise-library.js` boilerplate
- [ ] Update `App.js` imports
- [ ] Update `App.js` Stack.Navigator routes
- [ ] Set `initialRouteName="Intro"` in Stack.Navigator
- [ ] Test app launch (IntroScreen shows first)
- [ ] Verify no console errors

---

## Success Criteria

- ✅ App launches with IntroScreen (placeholder) visible
- ✅ All 5 navigation routes defined (Intro, Main, Settings, Workout, Progress)
- ✅ No import errors or missing files
- ✅ Boilerplate screens use existing fonts and colors
- ✅ File structure follows existing patterns

---

## Risk Assessment

### Potential Issues
1. **Import path errors** (relative paths incorrect)
   - Mitigation: Test each import after adding
2. **Missing directories** (src/data, src/services don't exist)
   - Mitigation: Create directories first, verify with ls
3. **Navigation conflicts** (existing navigation breaks)
   - Mitigation: Keep existing routes intact, only add new ones

### Rollback Strategy
- Git commit before changes
- If navigation breaks, remove new routes and restore initialRouteName

---

## Security Considerations

- No sensitive data in exercise library (all public fitness info)
- No API calls or external data sources (hardcoded only)
- No AsyncStorage writes (read-only for settings)

---

## Next Steps

**Dependencies for next phases:**
- Phase 02 (IntroScreen) depends on: boilerplate file created
- Phase 03 (ProgressScreen) depends on: exercise library data
- Phase 04 (BottomSheet) depends on: calorie calculator
- Phase 07 (Components) depends on: BottomIndicatorBar file

**After completion:**
- Proceed to Phase 02: IntroScreen Implementation
- Use created boilerplate files as foundation
- Exercise library ready for ProgressScreen
