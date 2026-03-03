---
status: completed
created: 2026-03-04
slug: save-workout-name
priority: medium
effort: small
---

# Save Workout Name Button

## Summary

Add SAVE button next to workout name input on completion BottomSheet. User can rename workout → press SAVE → alert confirms → icon changes to saved state → input disabled. Custom name persists in history.

## Current State

- `BottomSheet.js`: Shows "Workout completed" modal with name input (no save action)
- `WorkoutScreen.js:125`: Auto-saves workout on completion via `saveCompletedWorkout(workoutName, exerciseMuscle)`
- `workout-history-storage.js`: Stores `{exerciseName, muscle, timestamp}` — no custom name support
- `history-tab.js`: Displays `item.exerciseName` — no custom name fallback

## Architecture

```
[WorkoutScreen] --auto-save--> [workout-history-storage] (exerciseName)
       |
  [BottomSheet] --SAVE btn--> [workout-history-storage] (update customName)
       |
  [ProgressScreen] --> [history-tab] (show customName || exerciseName)
```

## Phases

| # | Phase | Status | Files |
|---|-------|--------|-------|
| 1 | [Storage layer](#phase-1) | complete | `workout-history-storage.js` |
| 2 | [BottomSheet UI](#phase-2) | complete | `BottomSheet.js` |
| 3 | [History display](#phase-3) | complete | `history-tab.js` |

---

## Phase 1: Storage Layer

**File:** `src/data/workout-history-storage.js`

Add `updateWorkoutName(timestamp, customName)` function:

```js
export async function updateWorkoutName(timestamp, customName) {
  try {
    const workouts = await getCompletedWorkouts();
    const index = workouts.findIndex(w => w.timestamp === timestamp);
    if (index === -1) return false;
    workouts[index].customName = customName;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    return true;
  } catch (e) {
    console.warn('Failed to update workout name:', e);
    return false;
  }
}
```

Also update `saveCompletedWorkout` to return the timestamp so BottomSheet can reference it:

```js
// Change return type: return timestamp for later reference
existing.push({ exerciseName, muscle: muscle || 'general', timestamp: Date.now() });
// ... save ...
return existing[existing.length - 1].timestamp;
```

**Data structure change:**
```js
// Before
{ exerciseName, muscle, timestamp }

// After (customName is optional)
{ exerciseName, muscle, timestamp, customName? }
```

- [x] Backward compatible — old data without `customName` still works

---

## Phase 2: BottomSheet UI

**File:** `src/components/BottomSheet.js`

### Changes

1. Import `Save`, `CheckCircle` from `lucide-react-native` + `Alert` from react-native
2. Add new prop: `workoutTimestamp` (from WorkoutScreen)
3. Add state: `const [isSaved, setIsSaved] = useState(false)`
4. Replace standalone `<TextInput>` with input + button row layout
5. On SAVE press: call `updateWorkoutName(workoutTimestamp, name)` → Alert → set `isSaved(true)`

### UI Layout

```
┌─────────────────────────────────────┐
│ Name your workout                   │
│ ┌──────────────────────┐ ┌────────┐ │
│ │ Front chest - dumbell│ │🔖 SAVE │ │
│ └──────────────────────┘ └────────┘ │
└─────────────────────────────────────┘
```

After save:
```
┌─────────────────────────────────────┐
│ Name your workout                   │
│ ┌──────────────────────┐ ┌────────┐ │
│ │ My custom name (gray)│ │✅ SAVED│ │
│ └──────────────────────┘ └────────┘ │
└─────────────────────────────────────┘
```

### Styles to add

- `nameRow`: `{ flexDirection: 'row', width: '80%', gap: 8 }`
- `nameInput`: shrink to `flex: 1` (remove fixed `width: '80%'`)
- `saveButton`: purple bg, rounded, row with icon + text
- `saveButtonDisabled`: muted bg when saved

---

## Phase 3: History Display

**File:** `src/components/history-tab.js`

### Change

Line 40: Replace `{item.exerciseName}` with `{item.customName || item.exerciseName}`

That's it. One line change.

---

## WorkoutScreen Integration

**File:** `src/screens/WorkoutScreen.js`

### Changes

1. Store returned timestamp from `saveCompletedWorkout`:
```js
const [savedTimestamp, setSavedTimestamp] = useState(null);

useEffect(() => {
  if (isComplete && totalWorkoutTimeInSec > 0) {
    setShowBottomSheet(true);
    saveCompletedWorkout(workoutName, exerciseMuscle).then(ts => setSavedTimestamp(ts));
  }
}, [isComplete]);
```

2. Pass timestamp to BottomSheet:
```jsx
<BottomSheet
  ...
  workoutTimestamp={savedTimestamp}
/>
```

---

## Risk Assessment

- **Low risk**: Feature is additive, no breaking changes
- **Backward compatible**: Old data without `customName` renders normally via `|| exerciseName` fallback
- **Edge case**: User presses SAVE with empty name → use `workoutName` default

## Success Criteria

- [x] SAVE button visible next to input on BottomSheet
- [x] Pressing SAVE shows alert + changes icon to CheckCircle
- [x] Input becomes disabled after save
- [x] History tab shows custom name when set
- [x] Old workouts without custom name still display correctly
