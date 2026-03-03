# Code Review — Save Workout Name

**Date:** 2026-03-04
**Files reviewed:** 4 modified files
**Plan:** `plans/260304-0116-save-workout-name/plan.md`

---

## Scope

| File | LOC | Role |
|------|-----|------|
| `src/data/workout-history-storage.js` | 65 | Storage layer (new file) |
| `src/components/BottomSheet.js` | 237 | UI — save button, isSaved state |
| `src/components/history-tab.js` | 110 | Display — customName fallback |
| `src/screens/WorkoutScreen.js` | 353 | Orchestration — savedTimestamp wiring |

## Overall Assessment

Feature is architecturally sound and backward-compatible. Core async flow (save → timestamp → BottomSheet → update) is correctly implemented. Three issues need attention: one high-priority race condition, one medium UX gap, and two low-priority style artifacts.

---

## Critical Issues

None.

---

## High Priority

### H1 — Race condition: Modal renders before `savedTimestamp` is set

**File:** `src/screens/WorkoutScreen.js` L124–128

```js
useEffect(() => {
    if (isComplete && totalWorkoutTimeInSec > 0) {
        setShowBottomSheet(true);                                          // <-- renders immediately
        saveCompletedWorkout(workoutName, exerciseMuscle).then(ts => setSavedTimestamp(ts)); // async
    }
}, [isComplete]);
```

`setShowBottomSheet(true)` fires synchronously. `savedTimestamp` is `null` when `BottomSheet` first renders. If the user taps SAVE before the `.then()` resolves (unlikely in practice but possible on slow devices), `updateWorkoutName(null, saveName)` is called.

**In `updateWorkoutName`:**
```js
const index = workouts.findIndex(w => w.timestamp === null); // never matches
if (index === -1) return false;  // silent failure
```

The save silently fails. User sees no error — `isSaved` stays `false`, button stays pressable.

**Fix:** Either (a) show the modal only after the timestamp is known, or (b) disable the SAVE button while `workoutTimestamp` is null.

Option (b) is simpler and non-breaking:
```jsx
// BottomSheet.js
<TouchableOpacity
    style={[styles.saveButton, (isSaved || !workoutTimestamp) && styles.saveButtonSaved]}
    onPress={handleSave}
    disabled={isSaved || !workoutTimestamp}
>
```

Option (a) in WorkoutScreen:
```js
saveCompletedWorkout(workoutName, exerciseMuscle).then(ts => {
    setSavedTimestamp(ts);
    setShowBottomSheet(true);  // show only after timestamp is ready
});
```

Option (a) is preferred — it eliminates the null state entirely.

---

## Medium Priority

### M1 — Duplicate workout suppression blocks rename after "Next Exercise"

**File:** `src/data/workout-history-storage.js` L11–14

```js
const alreadyExists = existing.some(
    (w) => w.exerciseName === exerciseName && w.muscle === muscle
);
if (alreadyExists) return null;   // <-- returns null, no timestamp
```

If the user completes the same exercise a second time (e.g., comes back after "Next Exercise"), `saveCompletedWorkout` returns `null`. `savedTimestamp` stays `null`. The SAVE button will silently fail (same race as H1).

This is a business logic question more than a bug, but the current behavior is:
- Exercise already saved → `savedTimestamp = null` → SAVE fails silently.

The user has no indication the duplicate was skipped. At minimum, `WorkoutScreen` should handle the `null` return:

```js
saveCompletedWorkout(workoutName, exerciseMuscle).then(ts => {
    setSavedTimestamp(ts);     // null if duplicate
    setShowBottomSheet(true);
});
```

And in `BottomSheet`, disable SAVE when `workoutTimestamp` is null (per H1 fix) so the UI stays coherent.

### M2 — No user feedback when save fails (`updateWorkoutName` returns false)

**File:** `src/components/BottomSheet.js` L14–21

```js
const handleSave = async () => {
    const saveName = name.trim() || workoutName || 'Workout';
    const success = await updateWorkoutName(workoutTimestamp, saveName);
    if (success) {
        setIsSaved(true);
        Alert.alert('Saved!', 'Workout name has been saved.');
    }
    // else: silent failure
};
```

If `updateWorkoutName` returns `false` (timestamp not found, or storage error), the function exits silently. The button stays pressable and no message appears. Add an else branch:

```js
} else {
    Alert.alert('Error', 'Could not save workout name. Please try again.');
}
```

---

## Low Priority

### L1 — Duplicate style property in `statsContainer`

**File:** `src/components/BottomSheet.js` L167–176

```js
statsContainer: {
    ...
    justifyContent: 'center',        // line 171 (old, leftover)
    flexDirection: 'row',
    justifyContent: 'space-between', // line 173 (correct, new)
},
```

The first `justifyContent: 'center'` is a leftover from the pre-diff code — visible in the diff. In JS object literals, the last value wins so behavior is correct, but it is dead code and will trigger an ESLint `no-dupe-keys` warning.

**Fix:** Remove line 171 (`justifyContent: 'center'`).

### L2 — `statsContainerItem` duplicate `alignItems` in diff (resolved at runtime, cosmetic)

**File:** `src/components/BottomSheet.js` (diff artifact)

The diff shows two `alignItems: 'center'` declarations in `statsContainerItem`. The final file (L177–180) has only one, so this is not a runtime issue — likely a diff display artifact from overlapping context. Confirmed clean in the actual file.

---

## Edge Cases Verified

| Scenario | Handled? | Notes |
|----------|----------|-------|
| Empty name input → SAVE | Yes | Falls back to `workoutName \|\| 'Workout'` |
| Old workout data (no `customName`) | Yes | `item.customName \|\| item.exerciseName` fallback in history-tab |
| `updateWorkoutName` storage error | Partial | Returns false, but no user feedback (M2) |
| `savedTimestamp = null` when SAVE pressed | Partial | Silent fail — needs fix (H1) |
| Duplicate workout prevents save | Partial | No UX signal to user (M1) |
| Dark mode colors | Yes | All new styles use `theme.colors.*` |

---

## Positive Observations

- Clean separation: storage update function is isolated, testable, backward-compatible.
- `isSaved` state correctly drives both `disabled` and icon swap — good UX pattern.
- `workoutName || 'Workout'` final fallback prevents empty string being stored.
- `history-tab.js` change is minimal and correct — one-line, zero risk.
- Theme integration is consistent: `useTheme()` + `useMemo(() => createStyles(theme), [theme])` matches project pattern.
- `KeyboardAvoidingView` + `keyboardShouldPersistTaps="handled"` is the correct pattern for input inside a modal.

---

## Plan TODO Status

| Criterion | Status |
|-----------|--------|
| SAVE button visible next to input | Done |
| Pressing SAVE shows alert + changes icon | Done (but fails silently on null timestamp) |
| Input becomes disabled after save | Done |
| History tab shows custom name | Done |
| Old workouts without custom name display correctly | Done |

Plan phases 1–3 are implemented. The plan's success criteria are met functionally; the H1 race condition is a gap not covered by the original risk assessment.

---

## Recommended Actions (Priority Order)

1. **[H1 — Required]** Move `setShowBottomSheet(true)` inside the `.then()` callback so modal never renders with `null` timestamp.
2. **[M2 — Should fix]** Add `Alert.alert('Error', ...)` in the `else` branch of `handleSave` for failed saves.
3. **[M1 — Consider]** Decide behavior for duplicate-exercise completion — either allow re-saving with a new timestamp or show a message that the workout was already recorded.
4. **[L1 — Cleanup]** Remove duplicate `justifyContent: 'center'` from `statsContainer` style.

---

## Unresolved Questions

- Should duplicate exercise completions (same name + muscle) overwrite the existing record or always create a new entry? Current deduplication means a user who repeats an exercise gets no new history entry and cannot rename the existing one from the current session.
- Is there intent to add an "edit name" affordance directly in history-tab, or is save-on-completion the only entry point for custom names?
