# Analysis: Circular Progress Ring - Timing Calculation Logic

**Date:** 2026-02-05
**Purpose:** Analyze how progress ring fills exactly matching workout duration
**Note:** UI remains unchanged (4 white dots at ring center, r=4)

---

## 📸 Data From Screenshots

### Screenshot 1 - Workout Setup:
- **Sets:** 1
- **Reps:** 5
- **Break(s):** 10 seconds

### Screenshot 2 - Workout Running:
- **Timer:** 00:06 (6 seconds elapsed)
- **Progress bar:** 0:00 → 00:10 (total duration: 10 seconds)
- **Ring visual:** ~60% filled (purple progress covers ~60% of circle)
- **Math check:** 6/10 = 0.6 = 60% ✓

---

## 🎯 Core Calculation Logic

### 1. Total Workout Duration Formula

```
Total Duration (seconds) = (Sets × Reps × Time_per_rep) + ((Sets - 1) × Break_time)
```

**Example from Screenshot 1:**
```
Sets = 1
Reps = 5
Break = 10 seconds
Observable total time = 10 seconds (from screenshot 2)

Therefore:
(1 × 5 × Time_per_rep) + ((1 - 1) × 10) = 10
5 × Time_per_rep + 0 = 10
Time_per_rep = 2 seconds
```

**General case (multiple sets):**
```
Sets = 3
Reps = 10
Time_per_rep = 3 seconds
Break = 30 seconds

Total = (3 × 10 × 3) + ((3 - 1) × 30)
      = (30 × 3) + (2 × 30)
      = 90 + 60
      = 150 seconds (2:30)
```

---

### 2. Progress Percentage Calculation

```
Current Progress (%) = (Elapsed Time / Total Duration) × 100
```

**From Screenshot 2:**
```
Elapsed = 6 seconds
Total = 10 seconds
Progress = (6 / 10) × 100 = 60%
```

**Important:** Timer counts DOWN, but progress counts UP:
```
Timer: 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2 → 1 → 0
       ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓
Progress: 0% → 10% → 20% → 30% → 40% → 50% → 60% → 70% → 80% → 90% → 100%

Elapsed = Total - Remaining
```

---

### 3. Ring Fill Animation Math

#### SVG Circle Progress Ring:
```
Radius (r) = 42 (viewBox units)
Stroke Width = 15 (viewBox units)
Circumference (C) = 2 × π × r
                  = 2 × π × 42
                  = 263.89 ≈ 264
```

#### Stroke Dash Animation:
```
strokeDasharray = 264 (total circumference)
strokeDashoffset = 264 - (264 × Progress%)

Progress 0%:   offset = 264 - (264 × 0)    = 264  (empty, no fill)
Progress 25%:  offset = 264 - (264 × 0.25) = 198  (1/4 filled)
Progress 50%:  offset = 264 - (264 × 0.5)  = 132  (half filled)
Progress 75%:  offset = 264 - (264 × 0.75) = 66   (3/4 filled)
Progress 100%: offset = 264 - (264 × 1)    = 0    (full circle)
```

**Visual representation:**
```
offset=264 ──────────────────────────────────→ offset=0
  0%      25%       50%       75%      100%
  ○       ◔         ◑         ◕         ●
Empty   Quarter   Half    3-Quarter   Full
```

---

### 4. Time → Ring Sync Logic

#### Current Implementation (from CircularProgressBar.js):

```javascript
// Step 1: Initialize animation
const duration = totalWorkoutTimeInSec * 1000; // Convert to milliseconds
const animatedValue = useRef(new Animated.Value(0)).current;

// Step 2: Start animation (0 → 100 over duration)
Animated.timing(animatedValue, {
    toValue: 100,
    duration: duration,          // e.g., 10000ms for 10 seconds
    easing: Easing.linear,       // CRITICAL: Linear for constant speed
    useNativeDriver: true,
}).start();

// Step 3: Every animation frame (60fps), update ring
animatedValue.addListener(v => {
    const maxPerc = (100 * v.value) / 100;  // Get current progress %
    const strokeDashoffset = circumference - (circumference * maxPerc) / 100;

    circleRef.current.setNativeProps({
        strokeDashoffset: strokeDashoffset
    });
});
```

#### Why This Works:

1. **Linear Easing:** Ensures constant speed
   - No acceleration/deceleration
   - Each second = same amount of ring fill

2. **Duration Match:** Animation duration = workout duration
   - 10 second workout → 10000ms animation
   - Ring completes 360° exactly when timer hits 0

3. **Frame-by-frame Update:** 60fps smooth
   - Every 16.67ms (1/60 second), strokeDashoffset updates
   - Human eye sees smooth continuous motion

---

## 📊 Timing Breakdown Example

### Workout: 1 Set × 5 Reps × 2sec = 10 seconds

```
Time (s)  | Remaining | Elapsed | Progress% | Offset | Visual
----------|-----------|---------|-----------|--------|--------
0         | 10        | 0       | 0%        | 264    | ○ Empty
1         | 9         | 1       | 10%       | 238    | ◔
2         | 8         | 2       | 20%       | 211    | ◔
3         | 7         | 3       | 30%       | 185    | ◔
4         | 6         | 4       | 40%       | 158    | ◑
5         | 5         | 5       | 50%       | 132    | ◑
6         | 4         | 6       | 60%       | 106    | ◑ ← Screenshot 2
7         | 3         | 7       | 70%       | 79     | ◕
8         | 2         | 8       | 80%       | 53     | ◕
9         | 1         | 9       | 90%       | 26     | ◕
10        | 0         | 10      | 100%      | 0      | ● Full
```

---

## 🔄 Complete Animation Flow

```
User taps "Start"
    ↓
Calculate total_time = (sets × reps × time_per_rep) + breaks
    ↓
Initialize Animated.Value(0)
    ↓
Start Animated.timing(0 → 100, duration = total_time × 1000, linear)
    ↓
Every frame (60fps):
    ↓
    ├─ Get current animated value (0-100)
    ├─ Calculate progress% = value
    ├─ Calculate offset = 264 - (264 × progress% / 100)
    ├─ Update ring: setNativeProps({ strokeDashoffset })
    ├─ Update text: setNativeProps({ text: `${current}/${total}` })
    └─ Update timer: countdown from total_time
    ↓
When timer = 0:
    ↓
    ├─ Progress = 100%
    ├─ Offset = 0
    └─ Ring = Full circle ✓
```

---

## 💡 Key Insights

### 1. Why Linear Easing is Critical:
```
Easing.linear:     ────────────────────  (constant speed)
Easing.ease:       ╱───────────────╲    (slow-fast-slow, NOT accurate)
Easing.easeIn:     ╱─────────────────   (starts slow, ends fast)
Easing.easeOut:    ─────────────────╲   (starts fast, ends slow)
```

Only `Easing.linear` gives 1:1 mapping between time and progress.

### 2. Frame Rate Independence:
- Animation uses `useNativeDriver: true`
- Runs on UI thread at 60fps
- Timer updates on JS thread at 1Hz (every second)
- Both sync to same duration → always aligned

### 3. Math Precision:
```
JavaScript:     0.6 × 264 = 158.4
SVG rendering:  Handles decimal values perfectly
Result:         Smooth, pixel-perfect animation
```

---

## 🎯 Verification Formula

To verify ring sync is correct:

```
At any moment:
    Elapsed_time (s) = Total_time - Remaining_time
    Expected_progress% = (Elapsed / Total) × 100
    Expected_offset = 264 - (264 × Expected_progress% / 100)

    Actual_offset (from animation) should equal Expected_offset

Example at 6 seconds:
    Expected_progress = (6 / 10) × 100 = 60%
    Expected_offset = 264 - (264 × 0.6) = 105.6
    Visual check: Ring ~60% filled ✓
```

---

## 📝 Summary

### Core Formula:
```
Duration (ms) = Total_workout_time × 1000
Progress (%) = (Elapsed_time / Total_time) × 100
StrokeDashoffset = 264 - (264 × Progress% / 100)
```

### Critical Requirements:
1. ✅ Linear easing (constant speed)
2. ✅ Duration = actual workout time
3. ✅ 60fps smooth updates
4. ✅ Circumference = 2πr = 264

### Result:
- Ring completes **exactly 360°** when workout completes
- Visual progress **matches timer** at all times
- Smooth, **frame-independent** animation

---

## ❓ Unresolved Questions

1. How is `time_per_rep` determined? Fixed constant or user setting?
2. Does pause/resume affect animation sync?
3. Are there break periods between reps, or only between sets?
4. Does animation reset between sets or continue accumulating?
5. What happens if user backgrounds the app mid-workout?

---

**End of Analysis**
