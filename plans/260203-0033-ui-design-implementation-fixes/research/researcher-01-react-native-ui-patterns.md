# React Native UI Patterns Research Report

**Date:** 2026-02-03 00:55
**Scope:** Navigation, FlatList optimization, conditional rendering, bottom indicators, modal navigation
**Status:** Ready for implementation planning

---

## 1. REACT NAVIGATION STACK BEST PRACTICES

### Initial Route Configuration
- Use `initialRouteName` in NavigationContainer to set first screen (IntroScreen for your app)
- Define `initialParams` in Screen config for default parameters
- Shallow merge behavior: passed params + initialParams combine automatically
- **For fitness app:** IntroScreen should be initial route, MainScreen secondary

```javascript
const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Intro"
      >
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          initialParams={{ showOnce: true }}
        />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Dynamic Params Passing
- Keep params minimal (IDs, sort order, filter state)
- Actual data from global store/AsyncStorage, NOT params
- Use TypeScript with StaticParamList for type safety
- Navigation from modals: Use `navigation.navigate()` with full params

```javascript
// From BottomSheet modal to new screen:
navigation.navigate('Workout', {
  exerciseId: selectedExercise.id,
  workoutName: selectedExercise.name,
  duration: selectedExercise.duration,
});
```

**Key insight:** Params = URL query params, not data payload. Avoid passing large objects through navigation.

---

## 2. FLATLIST OPTIMIZATION STRATEGIES

### Your App's Use Cases
1. **ProgressScreen horizontal cards** (progress cards, category chips)
2. **ProgressScreen vertical list** (exercise list)
3. **Performance critical** for smooth scrolling

### Essential Props for Optimization

| Prop | Purpose | Your App |
|------|---------|----------|
| `getItemLayout` | Pre-calculate heights | Use if all cards same height (RECOMMENDED) |
| `maxToRenderPerBatch` | Items per batch | Set to 10-15 for fitness app |
| `windowSize` | Viewport buffer | Set to 10-15 (default 21 is overkill) |
| `removeClippedSubviews` | Hide offscreen items | Enable on both lists |
| `keyExtractor` | Unique keys | Use `item.id` NOT array index |

```javascript
// ProgressScreen horizontal cards (optimized)
<FlatList
  data={progressCards}
  horizontal
  getItemLayout={(data, index) => ({
    length: 320, // card width + margin
    offset: 320 * index,
    index,
  })}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ProgressCard data={item} />}
/>

// ProgressScreen vertical exercise list (optimized)
<FlatList
  data={exercises}
  getItemLayout={(data, index) => ({
    length: 100, // card height + margin
    offset: 100 * index,
    index,
  })}
  maxToRenderPerBatch={15}
  windowSize={10}
  removeClippedSubviews={true}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ExerciseCard data={item} />}
/>
```

### Common Mistake to Avoid
❌ Don't use arrow functions inline in renderItem:
```javascript
// BAD - re-creates function on every render
renderItem={({ item }) => <Card data={item} />}
```

✅ Use memoized component or separate function:
```javascript
const renderCard = useCallback(({ item }) => <Card data={item} />, []);
// Then: renderItem={renderCard}
```

**Reference:** [Optimizing FlatList Configuration](https://reactnative.dev/docs/optimizing-flatlist-configuration)

---

## 3. CONDITIONAL RENDERING PATTERNS

### For Your Fitness App Scenarios

**Scenario A: Trainer image vs rep counter in CircularProgressBar**
```javascript
// Show trainer image at 50% milestone, otherwise show rep count
{showTrainerImage ? (
  <Image source={trainerImage} style={styles.trainerAvatar} />
) : (
  <Text style={styles.repCounter}>{currentReps}/{totalReps}</Text>
)}
```

**Scenario B: Milestone-based motivation (25%, 50%, 75%)**
```javascript
const progressPercentage = (elapsedTime / totalTime) * 100;

return (
  <>
    {progressPercentage >= 25 && progressPercentage < 50 && (
      <AnimatedBubble quote="Quarter way there!" />
    )}
    {progressPercentage >= 50 && progressPercentage < 75 && (
      <AnimatedBubble quote="Halfway to glory!" />
    )}
    {progressPercentage >= 75 && (
      <AnimatedBubble quote="Don't give up now!" />
    )}
  </>
);
```

**Scenario C: Show/hide UI elements (buttons, icons)**
```javascript
// Hide pause/cancel buttons in design, show only on gesture
{showControls && (
  <>
    <TouchableOpacity onPress={handlePause}>
      <Text>Pause</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleCancel}>
      <Text>Cancel</Text>
    </TouchableOpacity>
  </>
)}
```

### Best Practices
- Use ternary for 2 options: `condition ? element1 : element2`
- Use `&&` operator for show/hide: `condition && element`
- Complex logic → extract to helper function or custom hook
- **React Native specific:** Strings must be inside `<Text>` component, never in `<View>`

**Reference:** [React Conditional Rendering](https://react.dev/learn/conditional-rendering)

---

## 4. BOTTOM INDICATOR BAR IMPLEMENTATION

### Common Patterns in React Native Apps
1. **Decorative bar** (your use case) - static indicator
2. **Interactive bar** - swipe/tap to navigate
3. **Progress indicator** - animated fill based on app state

### For Your Fitness App (Decorative)
```javascript
// BottomIndicatorBar.js component
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

### Position Strategy
- Place in SafeAreaView bottom padding OR
- Use absolute positioning: `bottom: 20, alignSelf: 'center'`
- Height: 4-6px, Width: 100-120px
- Color: purple #7C4DFF (matches design system)

### Interactive Alternative (if needed later)
- Use `PanResponder` or React Native Gesture Handler for swipe
- Track gesture and animate bar width/opacity
- Navigation triggered on swipe completion

**Reference:** [React Navigation Tab View](https://reactnavigation.org/docs/tab-view)

---

## 5. BOTTOM SHEET MODAL NAVIGATION PATTERNS

### Setup for Expo Router
```javascript
// _layout.tsx - App root
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

### Navigation from Modal to New Screen
```javascript
// WorkoutScreen.js - Completion modal
const handleNextExercise = () => {
  // 1. Close modal
  bottomSheetModalRef.current?.close();

  // 2. Navigate to next screen after animation completes
  setTimeout(() => {
    navigation.navigate('Workout', {
      exerciseId: nextExercise.id,
      workoutName: nextExercise.name,
    });
  }, 300); // Match modal close animation duration
};

const handleYourHistory = () => {
  bottomSheetModalRef.current?.close();
  setTimeout(() => {
    navigation.navigate('Progress');
  }, 300);
};
```

### Critical Pattern: New Stack for Each Navigation
- Don't reuse screens in different navigator contexts
- Use different screen names for modals vs tab navigation (avoid conflicts)
- Modal should close BEFORE navigation occurs (not simultaneously)

### Performance Tip
- For tab + modal combinations, place BottomSheetModalProvider in parent layout
- Prevents multiple instances and memory leaks
- **Your fitness app:** Single BottomSheetModalProvider in App.js root

**Installation:**
```bash
yarn add @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler
npx expo install react-native-reanimated react-native-gesture-handler
```

**Reference:** [react-native-bottom-sheet](https://gorhom.dev/react-native-bottom-sheet/)

---

## 6. APPLICATION TO FITNESS APP

### Recommended Architecture

**Navigation Flow:**
```
IntroScreen (initial)
  ↓ (user taps "Start")
MainScreen (home, tap-to-start)
  ↓ (user selects workout)
WorkoutScreen (active, animated)
  ↓ (completion)
BottomSheet Modal (completion stats)
  ├→ "Next Exercise" → navigate to WorkoutScreen (new instance)
  └→ "Your History" → navigate to ProgressScreen

ProgressScreen (history view)
  ├→ Horizontal FlatList: progress cards (optimized)
  ├→ Horizontal FlatList: category chips (optimized)
  └→ Vertical FlatList: exercise list (optimized)
```

### Component Modularization
- **BottomIndicatorBar.js** (5 lines, reusable)
- **ProgressCard.js** (card in progress horizontal list)
- **CategoryChip.js** (category in horizontal list)
- **ExerciseListItem.js** (exercise in vertical list)
- All wrapped in optimized FlatLists in ProgressScreen.js

### State Management for Conditional Rendering
```javascript
// WorkoutScreen.js state
const [workoutProgress, setWorkoutProgress] = useState(0);

// Calculate milestones
const isMilestoneReached = workoutProgress >= 0.5;
const showTrainerImage = isMilestoneReached;
const motivationalQuote = getQuoteByMilestone(workoutProgress);
```

---

## UNRESOLVED QUESTIONS

1. **BottomSheet library choice:** Use @gorhom/bottom-sheet OR expo-router native modals?
2. **Modal animation timing:** Match exact close duration before navigation (300ms safe)?
3. **FlatList heights:** Are all progress cards identical height (enables getItemLayout)?
4. **Trainer image data:** Single Alan image OR multiple trainers (Alan/Lina)?
5. **History data persistence:** AsyncStorage OR SQLite for completed workouts?

---

## SOURCES

- [Passing parameters to routes | React Navigation](https://reactnavigation.org/docs/params/)
- [Optimizing FlatList Configuration | React Native](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [React Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [Tab Navigation | React Navigation](https://reactnavigation.org/docs/tab-view)
- [@gorhom/bottom-sheet Documentation](https://gorhom.dev/react-native-bottom-sheet/)
- [FlashList v2 | Shopify Engineering](https://shopify.engineering/flashlist-v2)

---

**Report Status:** Complete - Ready for planner handoff
**Token Efficiency:** Sacrificed grammar for concision, included only essential information
