---
phase: 3
title: Integrate Voice Audio into WorkoutScreen
status: pending
priority: high
effort: medium
depends_on: [2]
---

# Phase 3: Integrate Voice Audio into WorkoutScreen

## Overview
Wire `WorkoutAudioManager` into `WorkoutScreen.js` — trigger rep sounds on rep change, schedule motivational between reps, and play motivational during break phases.

## Context
- `WorkoutScreen.js`: 362 lines, timer-driven workout with derived state
- `completedRepsInSet` derived from `elapsed` — changes when `Math.floor(timeInCycle / timeBetweenRepsInSec)` ticks
- `isInBreak` flag indicates break phase
- `playSounds` setting already exists (from SettingsContext)
- Current milestone quotes (25/50/75%) stay as-is — they use AnimatedBubble

## Implementation

### 1. Initialize Audio Manager

```js
// At top of WorkoutScreen component
const audioManagerRef = useRef(null);

useEffect(() => {
  if (!playSounds) return;
  const mgr = new WorkoutAudioManager();
  audioManagerRef.current = mgr;
  mgr.init().then(() => mgr.preload(reps));
  return () => mgr.cleanup();
}, []);
```

### 2. Track Rep Changes → Play Rep Sound

Need a ref to detect when `completedRepsInSet` changes (it's derived, not state).

```js
const prevRepRef = useRef(0);
const prevSetRef = useRef(1);

useEffect(() => {
  if (!playSounds || !audioManagerRef.current || isPaused || isComplete) return;
  const mgr = audioManagerRef.current;

  // Detect set change (reset tracking)
  if (currentSet !== prevSetRef.current) {
    prevRepRef.current = 0;
    prevSetRef.current = currentSet;
  }

  // Detect rep increment
  if (completedRepsInSet > prevRepRef.current && !isInBreak) {
    mgr.playRepSound(completedRepsInSet);

    // Schedule motivational between this rep and next
    if (mgr.shouldPlayMotivational(completedRepsInSet, reps)) {
      const delay = Math.floor(timeBetweenRepsInSec * 0.5) * 1000; // midpoint
      const timer = setTimeout(() => {
        if (!isPaused) mgr.playMotivational('rep-phase');
      }, delay);
      // Cleanup handled by next rep or unmount
    }

    prevRepRef.current = completedRepsInSet;
  }
}, [elapsed]); // runs every second
```

### 3. Break Phase Motivational

```js
useEffect(() => {
  if (!playSounds || !audioManagerRef.current || !isInBreak || isPaused) return;
  const mgr = audioManagerRef.current;

  // Play one motivational at start of break
  mgr.playMotivational('break-phase');

  // Then every ~8s during break
  const interval = setInterval(() => {
    if (!isPaused) mgr.playMotivational('break-phase');
  }, 8000);

  return () => clearInterval(interval);
}, [isInBreak, isPaused]);
```

### 4. Pause Handling

```js
// When paused, stop current audio
useEffect(() => {
  if (isPaused && audioManagerRef.current) {
    audioManagerRef.current._stopCurrent();
  }
}, [isPaused]);
```

### Integration Points (no changes needed)
- Milestone AnimatedBubbles (25/50/75%) — keep as-is, they handle own audio
- `playSounds` setting — reuse existing toggle to control voice audio
- Completion state — audio manager stops naturally when `isComplete`

## Expected Timeline Flow

```
[0s]  Workout starts, delay period
      AnimatedBubble: "Give me everything!" (existing)
[5s]  Rep 1 → 🔊 "One!"
[7s]  Set 1, 20% chance → maybe 🔊 "Keep Pushing!"
[10s] Rep 2 → 🔊 "Two!"
...
[45s] Rep 9 → 🔊 "Nine!" (80% chance motivational follows)
[47s] 🔊 "You're Almost There!"
[50s] Rep 10 → 🔊 "Ten!"
[50s] Break starts → 🔊 "Take Deep Breaths!"
[58s] 🔊 "Hydration!" (8s interval)
[66s] Set 2 starts, Rep 1 → 🔊 "One!"
...
```

## Success Criteria
- [ ] Rep number voice plays at start of each rep
- [ ] Motivational plays between reps with progressive frequency
- [ ] Break phase has motivational every ~8s
- [ ] Pausing stops audio, resuming continues
- [ ] Sound toggle (Settings) controls all voice audio
- [ ] No conflict with existing AnimatedBubble milestone sounds
- [ ] App compiles and runs without audio errors
