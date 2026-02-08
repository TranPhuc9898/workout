# Phase 04: BottomSheet

## Design (07.png)
- Badge icon
- "Great job! Workout completed"
- Stats: "20" Total Reps | "233" Calories Burnt*
- TWO buttons: "Next Exercise" + "Your History"

## Current Code (`src/components/BottomSheet.js`)
❌ Shows "Total Sets" instead of just "Total Reps"
❌ NO "Calories Burnt" stat
❌ Only ONE button: "Close"
❌ Missing "Next Exercise" button
❌ Missing "Your History" button (with arrow icon)

## Changes Needed

### 1. Update stats display
Change from "Total Sets + Total Reps" to "Total Reps + Calories":

```javascript
// Props: add calories
const BottomSheet = ({ totalReps, calories, onClose, onNextExercise, onViewHistory }) => {

// Update stats JSX:
<View style={styles.statsContainerItem}>
  <Text style={styles.stats}>{totalReps}</Text>
  <Text style={styles.statsType}>Total Reps</Text>
</View>
<View style={styles.verticalDivider} />
<View style={styles.statsContainerItem}>
  <Text style={styles.stats}>{calories}</Text>
  <Text style={styles.statsType}>Calories Burnt*</Text>
</View>
```

### 2. Replace "Close" with TWO buttons
```javascript
<View style={styles.buttonRow}>
  <TouchableOpacity 
    style={styles.nextButton}
    onPress={onNextExercise}
  >
    <Text style={styles.nextButtonText}>Next Exercise</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={styles.historyButton}
    onPress={onViewHistory}
  >
    <Text style={styles.historyButtonText}>Your History ➜</Text>
  </TouchableOpacity>
</View>
```

Styles:
```javascript
buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '80%',
  marginTop: 20,
},
nextButton: {
  backgroundColor: "#7C4DFF",
  padding: 16,
  borderRadius: 16,
  width: "48%",
  alignItems: "center",
},
nextButtonText: {
  color: "white",
  fontFamily: 'Overpass-Bold',
  fontSize: 18,
},
historyButton: {
  backgroundColor: "#7C4DFF",
  padding: 16,
  borderRadius: 16,
  width: "48%",
  alignItems: "center",
},
historyButtonText: {
  color: "white",
  fontFamily: 'Overpass-Bold',
  fontSize: 18,
},
```

### 3. Update WorkoutScreen.js usage
```javascript
// Calculate calories (simple formula)
const totalCalories = Math.round(sets * reps * 0.5);

// Update BottomSheet props:
<BottomSheet 
  totalReps={sets * reps}
  calories={totalCalories}
  onClose={handleCloseBottomSheet}
  onNextExercise={handleNextExercise}
  onViewHistory={handleViewHistory}
/>
```

Add handlers:
```javascript
const handleNextExercise = () => {
  setShowBottomSheet(false);
  // Reset and restart workout (MVP: same workout again)
  setTimeout(() => {
    navigation.replace('Workout', {
      workoutName: workoutName,
      sets: sets,
      reps: reps,
      breakTime: breakTime,
    });
  }, 300);
};

const handleViewHistory = () => {
  setShowBottomSheet(false);
  setTimeout(() => {
    navigation.navigate('Progress');
  }, 300);
};
```

## Success Criteria
- [x] Stats show "Total Reps" + "Calories Burnt*"
- [x] Two buttons: "Next Exercise" + "Your History"
- [x] "Next Exercise" restarts workout (same config)
- [x] "Your History" navigates to ProgressScreen
- [x] Matches 07.png design exactly

**Effort:** 45 min
