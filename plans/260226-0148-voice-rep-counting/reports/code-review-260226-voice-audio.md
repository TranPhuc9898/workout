# Code Review — Voice Rep Counting + Motivational Audio

**Date:** 2026-02-26
**Reviewer:** code-reviewer
**Plan:** plans/260226-0148-voice-rep-counting/

---

## Scope

- Files: `src/data/sound-registry.js`, `src/services/workout-audio-manager.js`, `src/hooks/use-workout-audio.js`, `src/screens/WorkoutScreen.js`
- Also cross-checked: `src/components/AnimatedBubble.js`
- LOC: ~650 total across reviewed files
- Focus: memory management, race conditions, stale closures, expo-av API, cleanup correctness

---

## Overall Assessment

The architecture is sound. Using a dedicated `WorkoutAudioManager` class with a custom hook is a clean separation. The Metro-compatible static `require()` registry is the correct approach. The biggest issues are a runtime crash (undefined variable), a stale closure that silently plays audio after pause, and an audio overlap gap between `AnimatedBubble` and `WorkoutAudioManager`. Everything else is low-risk.

---

## Critical Issues

### 1. `trainerId` used but never defined — runtime crash
**File:** `src/screens/WorkoutScreen.js:210`

`selectedTrainer` is destructured from context (line 18) but the prop passed to `CircularProgressBar` uses `trainerId` which is never assigned.

```js
// Line 18
const { selectedTrainer, ... } = useContext(SettingsContext);

// Line 210 — ReferenceError at runtime
trainerId={trainerId}   // should be: trainerId={selectedTrainer}
```

**Fix:**
```js
trainerId={selectedTrainer}
```

---

## High Priority

### 2. Stale closure: `isPaused` captured at effect schedule time, not callback invocation time
**File:** `src/hooks/use-workout-audio.js:56-58`

The `useEffect` at line 38 depends only on `[elapsed]`. Inside, a `setTimeout` callback closes over `isPaused` from the render cycle when that effect ran. If the user pauses AFTER the timeout is scheduled but BEFORE it fires, the callback still sees the old `isPaused = false` and plays audio.

```js
// Current — isPaused is stale inside the timeout
motivationalTimerRef.current = setTimeout(() => {
  if (!isPaused) mgr.playMotivational('rep-phase');  // stale value
}, delay);
```

**Fix:** Add an `isPausedRef` that's always current:
```js
const isPausedRef = useRef(isPaused);
useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

// Inside the timeout:
if (!isPausedRef.current) mgr.playMotivational('rep-phase');
```

### 3. `AnimatedBubble` audio bypasses `WorkoutAudioManager` — overlap possible
**File:** `src/components/AnimatedBubble.js:16` and `src/services/workout-audio-manager.js`

`AnimatedBubble` creates its own `Audio.Sound` independently. `WorkoutAudioManager.isPlaying` is blind to sounds playing in `AnimatedBubble`. This means:
- A rep count voice AND a milestone speech bubble can play simultaneously at a milestone boundary (e.g., 25% triggers both a rep sound and `quarterQuote` bubble).
- `WorkoutAudioManager.playMotivational` checks `this.isPlaying` but that flag is false when `AnimatedBubble` is playing.

No immediate fix is required to ship, but the `AnimatedBubble` audio should be routed through `WorkoutAudioManager.playSound(source, priority)` in a follow-up to centralize audio coordination.

### 4. `setOnPlaybackStatusUpdate` callback fires after `cleanup()` — null dereference risk
**File:** `src/services/workout-audio-manager.js:61-65, 87-91`

`cleanup()` calls `_stopCurrent()` then `sound.unloadAsync()`. However, the `setOnPlaybackStatusUpdate` callback on each sound object is not cleared before unload. After `unloadAsync()`, expo-av may fire a final status update with `didJustFinish: true`, at which point the callback sets `this.isPlaying = false` and `this.currentSound = null` — these writes are harmless but indicate a design gap.

More importantly, if `cleanup()` is called while a preloaded rep sound is mid-playback as `currentSound`, `_stopCurrent()` stops it and nulls `currentSound`, then `cleanup()` loops `preloadedReps` and calls `unloadAsync()` on the same object. The stop happens first so this works, but the old callback on that sound still holds a reference to `this` (the manager), keeping it alive after unmount.

**Fix:** Clear callbacks before unloading:
```js
async cleanup() {
  await this._stopCurrent();
  try {
    for (const sound of this.preloadedReps.values()) {
      sound.setOnPlaybackStatusUpdate(null);  // clear callback first
      await sound.unloadAsync();
    }
    for (const sound of [...this.motivationalPool.repPhase, ...this.motivationalPool.breakPhase]) {
      sound.setOnPlaybackStatusUpdate(null);
      await sound.unloadAsync();
    }
  } catch (error) { ... }
}
```

---

## Medium Priority

### 5. `finalQuotes` and milestone quote objects re-created on every render
**File:** `src/screens/WorkoutScreen.js:26-43`

`pickRandom()` is called inline at render time. `WorkoutScreen` re-renders every second (elapsed tick). Each render picks a new random audio source for all milestone quotes. This means:
- `startQuote.audio` changes each second; `AnimatedBubble`'s effect dep `quote.audio` changes, re-triggering the effect and reloading/replaying the sound while it's mid-play.
- `finalQuotes` array is rebuilt every second with new random audio picks even though it's only consumed once.

**Fix:** Wrap in `useRef` (initialised once) or `useMemo([])`:
```js
const startQuote = useRef({ text: "Give me everything you got!", audio: pickRandom(MILESTONE_SOUNDS.start) }).current;
const quarterQuote = useRef({ text: "Great job! Keep pushing!", audio: pickRandom(MILESTONE_SOUNDS.quarter) }).current;
const halfQuote = useRef({ text: "Halfway through...", audio: pickRandom(MILESTONE_SOUNDS.half) }).current;
const threeQuarterQuote = useRef({ text: "Almost done!...", audio: pickRandom(MILESTONE_SOUNDS.threeQuarter) }).current;
```
Or move to a `useMemo` with `[]` deps. Same fix applies to `finalQuotes`.

### 6. `useEffect` at line 26 (init/cleanup) has empty deps — `reps` and `playSounds` are stale
**File:** `src/hooks/use-workout-audio.js:26-35`

```js
useEffect(() => {
  if (!playSounds) return;
  const mgr = new WorkoutAudioManager();
  mgr.init().then(() => mgr.preload(reps));   // reps captured at mount
  ...
}, []);   // intentional but reps/playSounds are stale for lifetime of workout
```

This is acceptable since `reps` and `playSounds` are route params that don't change during a workout. Worth a comment to clarify intent:
```js
// eslint-disable-next-line react-hooks/exhaustive-deps
// reps and playSounds are route params — constant for workout lifetime
}, []);
```

### 7. Break-phase motivational plays immediately on entering break AND every 8 seconds — potential double-play at set transition
**File:** `src/hooks/use-workout-audio.js:66-74`

When `isInBreak` becomes `true`, `playMotivational('break-phase')` is called immediately (line 69) AND the interval starts simultaneously. If `WorkoutAudioManager.playMotivational` returns instantly (sound finishes very quickly), the interval's first tick at 8s may overlap with rep sounds from the next set if `breakTime < 8`.

The immediate play on line 69 is fine; the interval check `if (!isPaused)` on line 71 has the same stale closure issue as issue #2. Also the same `isPlaying` guard in `WorkoutAudioManager` will block overlap for the manager itself — this is safe enough in practice.

### 8. `_preloadMotivationalPool` uses biased shuffle
**File:** `src/services/workout-audio-manager.js:150`

```js
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
```

`Array.sort` with a random comparator is not a uniform shuffle (known JS gotcha — V8/JSC may call comparator fewer times than items). For a pool of 90 motivational clips picking 5, the bias is negligible. Low risk but worth noting.

**Better (one-liner Fisher-Yates slice):**
```js
const shuffle = (arr) => arr.reduceRight((a, _, i) => {
  const j = Math.floor(Math.random() * (i + 1));
  [a[j], a[i]] = [a[i], a[j]]; return a;
}, [...arr]);
```

---

## Low Priority

### 9. `WorkoutAudioManager.init()` resets `_initialized = false` on `cleanup()`
**File:** `src/services/workout-audio-manager.js:134`

Cleanup sets `_initialized = false`. If `preload()` is ever called again on the same instance after cleanup, it will silently no-op because `_initialized` is false. Since the hook creates a fresh instance per mount, this is fine in practice. If the class were ever reused, it would silently fail.

### 10. `sound-registry.js` exceeds 200-line project guideline
**File:** `src/data/sound-registry.js` — 209 lines

Per project code standards, files should be under 200 lines. This file can be split into `rep-sounds-registry.js`, `rep-phase-motivational-registry.js`, `break-phase-motivational-registry.js`, and a barrel `sound-registry.js` that re-exports all. This is cosmetic given Metro bundles everything statically anyway.

### 11. `AnimatedBubble` calls `Audio.setAudioModeAsync` on every sound load
**File:** `src/components/AnimatedBubble.js:15`

`WorkoutAudioManager.init()` already sets `playsInSilentModeIOS: true` globally. `AnimatedBubble` calling it again (without `staysActiveInBackground: false`) is redundant but harmless since it's idempotent. Could be removed from `AnimatedBubble` to reduce the call count.

---

## Positive Observations

- Static `require()` registry pattern is correct for Metro — zero risk of "module not found at runtime" errors.
- Priority system (rep interrupts motivational) is clean and correct: `_stopCurrent()` is called before every `playRepSound`.
- `setPositionAsync(0)` instead of `replayAsync()` is the right expo-av v14 call — `replayAsync` was deprecated.
- Random motivational subset preload (5 rep + 3 break) keeps memory footprint bounded while maintaining variety.
- Hook extraction from `WorkoutScreen` is clean — screen is only concerned with state derivation.
- `preloadedReps.clear()` + pool array reset in `cleanup()` properly releases the Map/array GC roots.
- Graceful degradation via `try/catch` on all audio operations — a missing file or device error won't crash the workout.
- `isInBreak` + `isPaused` guard on break interval correctly stops motivational when paused.
- Plan's phase 4 success criteria are fully met by the implementation.

---

## Plan TODO Completeness

All four plan phases are implemented:
- Phase 1 (organize assets + registry) — complete
- Phase 2 (audio manager service) — complete
- Phase 3 (integrate WorkoutScreen) — complete
- Phase 4 (fix AnimatedBubble audio) — complete (MILESTONE_SOUNDS used, require() sources passed)

Plan `plan.md` still shows all phases as `pending` — should be updated to `complete`.

---

## Recommended Actions (Prioritized)

1. **[Critical]** Fix `trainerId` → `selectedTrainer` in `WorkoutScreen.js:210` — prevents runtime crash.
2. **[High]** Add `isPausedRef` to fix stale closure in motivational `setTimeout` callback.
3. **[High]** Clear `setOnPlaybackStatusUpdate(null)` in `cleanup()` before `unloadAsync()` calls.
4. **[Medium]** Wrap milestone `startQuote`, `quarterQuote`, `halfQuote`, `threeQuarterQuote`, and `finalQuotes` in `useRef` or `useMemo([])` to prevent re-render churn and sound re-triggering.
5. **[Low]** Update `plan.md` phase statuses to `complete`.
6. **[Low]** Add eslint-disable comment to the `[]` dependency array useEffect to document the intentional stale capture.

---

## Unresolved Questions

1. Are there scenarios where `WorkoutScreen` is navigated away mid-workout without unmounting (e.g. background navigation)? If so, `cleanup()` in the hook's return function may not fire — consider a `AppState` listener for background cleanup.
2. The 152MB `.wav` asset folder: plan notes it should be `.gitignore`'d as a zip but the individual `.wav` files are already committed via `require()` bundling. Is the folder size acceptable for the app binary target? `.wav` → `.mp3` conversion would yield ~10x reduction.
3. `react-native-sound` is listed in `package.json` alongside `expo-av`. Is it still used anywhere? Duplicate audio libraries should be removed if unused.
