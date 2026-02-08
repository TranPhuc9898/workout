# Research Report: Data Structures & State Management for AI Fitness App

**Date:** 2026-02-03 | **Project:** AI Fitness App ProgressScreen Implementation
**Status:** COMPLETE

---

## 1. Exercise Data Structure

### Recommended JSON Format (Hardcoded Library)
```javascript
const EXERCISE_LIBRARY = [
  {
    id: "push-ups",
    name: "Push-ups",
    category: "Arms",
    caloriesPerRep: 0.5,
    description: "Upper body strength",
    mets: 3.8
  },
  {
    id: "squats",
    name: "Squats",
    category: "Legs",
    caloriesPerRep: 0.8,
    description: "Lower body strength",
    mets: 5.0
  },
  {
    id: "abs-crunch",
    name: "Crunches",
    category: "Abs",
    caloriesPerRep: 0.3,
    description: "Core strength",
    mets: 3.0
  }
];
```

**Rationale:**
- Hardcoded library avoids API calls during active workout (better offline UX)
- Simple JavaScript array beats JSON files (simpler imports, no file I/O)
- Category-based filtering supports UI grouping (Abs, Legs, Arms)
- MET values allow dynamic calorie calculations based on user weight
- Per-rep calorie estimates enable quick calculations

### File Organization
```
src/
├── data/
│   └── exercise-library.js    // Hardcoded exercises, categories
├── context/
│   ├── SettingsContext.js     // Trainer, rep pace, sounds
│   └── WorkoutContext.js      // NEW: Session state, history queue
└── services/
    └── workout-calculator.js   // Calorie formulas, MET calculations
```

---

## 2. Workout History Data Model

### AsyncStorage Schema (Key-Value)
```javascript
// Save individual workout session
const workoutSession = {
  id: "session_20260203_001",
  exerciseName: "Push-ups",
  date: "2026-02-03T12:30:00Z",
  totalReps: 20,
  totalSets: 4,
  totalTime: 240, // seconds
  caloriesBurned: 12.5,
  repPace: "2s",
  trainer: "1"
};

// AsyncStorage key: 'workoutSessions'
// Value: JSON.stringify([session1, session2, ...])
```

**Storage Limitations:**
- AsyncStorage ~6MB total limit, 2MB per record
- Use for current sessions; archive old data if needed
- NOT suitable for relational queries (no SQL joins)

### Best Practice Pattern
```javascript
// Custom hook for workout storage
const useWorkoutHistory = () => {
  const saveWorkoutSession = async (session) => {
    try {
      const existing = await AsyncStorage.getItem('workoutSessions');
      const sessions = existing ? JSON.parse(existing) : [];
      sessions.push({...session, id: `session_${Date.now()}`});
      await AsyncStorage.setItem('workoutSessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const loadWorkoutHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('workoutSessions');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  };

  return { saveWorkoutSession, loadWorkoutHistory };
};
```

---

## 3. Calories Calculation Formulas

### Simple Per-Exercise Formula
```javascript
const calculateCalories = (exerciseId, reps, userWeight) => {
  const exercise = EXERCISE_LIBRARY.find(e => e.id === exerciseId);
  const baseCalories = exercise.caloriesPerRep * reps;

  // Weight adjustment: 150 lbs = baseline
  const weightAdjustment = userWeight / 150;
  return (baseCalories * weightAdjustment).toFixed(1);
};
```

**Example:** 20 push-ups @ 170 lbs = 0.5 × 20 × (170/150) = **11.3 kcal**

### MET-Based Formula (Advanced)
```javascript
// MET = metabolic equivalent (energy ratio vs. resting)
// Formula: Calories = MET × Weight(kg) × Duration(hours)

const calculateCaloriesByMET = (exerciseId, reps, repPace, userWeight) => {
  const exercise = EXERCISE_LIBRARY.find(e => e.id === exerciseId);
  const durationMinutes = (reps * parseInt(repPace)) / 60;
  const durationHours = durationMinutes / 60;

  const weightKg = userWeight * 0.453592;
  const calories = exercise.mets * weightKg * durationHours;

  return calories.toFixed(1);
};
```

**Example:** Squats (5.0 MET), 15 reps @ 2s pace, 80kg = 5.0 × 80 × (30/3600) = **4.2 kcal**

### Recommendation
- Use simple per-exercise formula for MVP (faster, predictable)
- Add MET calculations later when tracking detailed user profiles
- Current app shows "233 calories" → likely based on total sets × reps × exercise type

---

## 4. State Management for Multi-Exercise Sessions

### WorkoutContext (NEW - Replaces prop drilling)
```javascript
// src/context/WorkoutContext.js
const WorkoutContext = createContext();

const WorkoutProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [exerciseQueue, setExerciseQueue] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);

  const startWorkout = (exercises) => {
    setExerciseQueue(exercises);
    setCompletedExercises([]);
    setCurrentSession({ startTime: Date.now() });
  };

  const completeExercise = (sessionData) => {
    setCompletedExercises(prev => [...prev, sessionData]);
    setExerciseQueue(prev => prev.slice(1)); // Dequeue
  };

  const resetWorkout = () => {
    setCurrentSession(null);
    setExerciseQueue([]);
    setCompletedExercises([]);
  };

  return (
    <WorkoutContext.Provider value={{
      currentSession,
      exerciseQueue,
      completedExercises,
      startWorkout,
      completeExercise,
      resetWorkout
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};
```

### Flow Pattern (Screen Navigation)
```
MainScreen (user selects exercise, sets, reps)
  → startWorkout([exercise])
  → WorkoutScreen (active workout)
    → completeExercise(sessionData)
    → showBottomSheet("Great job!")
      → "Next Exercise" → MainScreen (to queue next)
      → "Your History" → ProgressScreen
```

### Avoid Single Provider Explosion
- Split into `SettingsContext` (user prefs) + `WorkoutContext` (session state)
- Use `useMemo` to prevent re-renders:
```javascript
const value = useMemo(() => ({
  exerciseQueue,
  completedExercises,
  startWorkout,
  completeExercise
}), [exerciseQueue, completedExercises]);
```

---

## 5. React Context Best Practices

### When to Use vs. Avoid

| Scenario | Use Context | Alternative |
|----------|-------------|-------------|
| Settings (trainer, sound) | ✅ Yes | - |
| Session state (current exercise) | ✅ Yes | - |
| High-frequency updates (timer) | ❌ No | useState + useCallback |
| Complex nested state | ❌ Consider | Zustand/Redux |
| Shared across loose components | ✅ Yes | - |

### Performance Optimization
```javascript
// ✅ GOOD: Memoized value
const value = useMemo(() => ({
  trainer: selectedTrainer,
  saveSettings
}), [selectedTrainer]);

// ✅ GOOD: Split providers
<SettingsProvider>
  <WorkoutProvider>
    <App />
  </WorkoutProvider>
</SettingsProvider>

// ❌ AVOID: Object literal (causes re-renders)
<Context.Provider value={{ trainer: selectedTrainer }}>
```

### Existing Pattern Analysis
Current `SettingsContext` is well-designed:
- Uses `AsyncStorage` for persistence ✅
- Loads on app start (one-time) ✅
- Separate setter/getter functions ✅
- Could benefit from: `useMemo` on provider value

---

## 6. ProgressScreen Data Requirements

### Display Model (Summary Cards)
```javascript
const progressStats = {
  totalWorkouts: 12,
  totalReps: 450,
  totalCalories: 1850.5,
  favoriteExercise: "Push-ups",
  thisWeek: [
    { exerciseName: "Push-ups", reps: 50, calories: 25 },
    { exerciseName: "Squats", reps: 60, calories: 40 }
  ]
};
```

### Aggregation Function
```javascript
const aggregateWorkoutStats = (sessions) => {
  return sessions.reduce((acc, session) => ({
    totalReps: acc.totalReps + session.totalReps,
    totalCalories: acc.totalCalories + session.caloriesBurned,
    workoutCount: acc.workoutCount + 1
  }), { totalReps: 0, totalCalories: 0, workoutCount: 0 });
};
```

---

## 7. Implementation Priorities

| Priority | Task | Impact |
|----------|------|--------|
| 🔴 HIGH | Exercise library (hardcoded JSON) | Foundation for all calculations |
| 🔴 HIGH | WorkoutContext (session state) | Enable "Next Exercise" flow |
| 🔴 HIGH | Calorie calculator (simple formula) | Show "233 calories" in BottomSheet |
| 🟡 MED | Workout history (AsyncStorage) | ProgressScreen data source |
| 🟡 MED | useWorkoutHistory hook | Clean data access pattern |
| 🟢 LOW | MET-based calculations | Future enhancement |

---

## 8. Code Modularity Checklist

- [ ] Create `src/data/exercise-library.js` (<50 lines)
- [ ] Create `src/services/workout-calculator.js` (<100 lines)
- [ ] Create `src/context/WorkoutContext.js` (<150 lines)
- [ ] Create `src/hooks/useWorkoutHistory.js` (<80 lines)
- [ ] Update `App.js` to wrap `WorkoutProvider`
- [ ] Update `BottomSheet` to display calculated calories
- [ ] Create `ProgressScreen.js` (if not existing)

---

## Sources

- [React Native AsyncStorage Documentation](https://reactnative.dev/docs/asyncstorage)
- [Persisting Data in React Native - Pusher](https://pusher.com/tutorials/persisting-data-react-native/)
- [React Context Performance Optimization - DeveloperWay](https://www.developerway.com/posts/how-to-write-performant-react-apps-with-context)
- [Fitness Database Design - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/how-to-design-a-database-for-health-and-fitness-tracking-applications/)
- [MET Calculations - MyNetDiary](https://www.mynetdiary.com/metabolic-equivalent-met.html)
- [ExerciseDB API - GitHub](https://github.com/ExerciseDB/exercisedb-api)
