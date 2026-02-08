# Phase 03: WorkoutScreen

## Design (05.png + 06.png)

**05.png (State 1 - Rep Counting):**
- Bubble: "skibidi 5 more!"
- Circle: "10 / 15" rep counter
- Workout name + timer
- Horizontal progress bar with time labels: "0:00" and "2:43"
- NO Pause/Cancel buttons visible

**06.png (State 2 - Motivation):**
- Bubble: "don't you give up"
- Circle: Trainer image (Alan) inside ring
- Same layout otherwise

## Current Code (`src/screens/WorkoutScreen.js`)
❌ Pause/Cancel buttons visible (lines 204-211)
❌ Notifications icon visible (top-right)
❌ CircularProgressBar only shows trainer at timer=0
❌ HorizontalProgressBar has NO time labels
❌ No bottom indicator bar

## Changes Needed

### 1. Hide Pause/Cancel buttons (lines 204-211)
```javascript
// REMOVE entire buttonRow View:
// <View style={styles.buttonRow}>
//   ...
// </View>
```

**Alternative:** Keep for accessibility but style as floating icons?
→ Decision: Remove for now (match design)

### 2. Hide notifications icon (lines 171-176)
```javascript
// REMOVE iconsContainer entirely
```

### 3. Fix CircularProgressBar timing
Pass `showTrainerImage` prop based on milestones:
```javascript
const showTrainerAtMilestone = (
  (timer <= (totalWorkoutTimeInSec * 3/4) && timer > ((totalWorkoutTimeInSec * 3/4) - 3)) ||
  (timer <= (totalWorkoutTimeInSec / 2) && timer > ((totalWorkoutTimeInSec / 2) - 3)) ||
  (timer <= (totalWorkoutTimeInSec / 4) && timer > ((totalWorkoutTimeInSec / 4) - 3))
);

<CircularProgressBar 
  duration={totalWorkoutTimeInSec * 1000}
  sets={sets}
  reps={reps}
  breakTime={breakTime}
  timer={timer}
  remainingReps={remainingReps}
  remainingSets={remainingSets}
  isPaused={isPaused}
  showTrainerImage={showTrainerAtMilestone}
  trainerId={trainerId}
/>
```

### 4. Update CircularProgressBar component
In `src/components/CircularProgressBar.js`:

Add props:
```javascript
const CircularProgressBar = ({ 
  duration, sets, reps, breakTime, timer, 
  remainingReps, remainingSets, isPaused,
  showTrainerImage = false,  // NEW
  trainerId = "1"  // NEW
}) => {
```

Update image logic (line 82):
```javascript
{showTrainerImage && (
  <Image
    source={trainerId === "1" 
      ? require('../../assets/trainer-alan.png')
      : require('../../assets/trainer-lina.png')
    }
    style={[StyleSheet.absoluteFill, { width: 230, height: 230, borderRadius: 120, zIndex: 0 }]}
    resizeMode="cover"
  />
)}
```

Update rep counter visibility (line 117):
```javascript
{!showTrainerImage && timer > 0 && (
  <AnimatedText ... />
)}
```

### 5. Update HorizontalProgressBar
Pass total duration for time labels:
```javascript
<HorizontalProgressBar 
  durationInSec={totalWorkoutTimeInSec} 
  isPaused={isPaused} 
  delayInSec={delayInSec}
  showTimeLabels={true}  // NEW
/>
```

(Implement labels in Phase 06)

### 6. Add bottom indicator
```javascript
import BottomIndicatorBar from '../components/BottomIndicatorBar';

// Before closing </View>:
<BottomIndicatorBar />
```

## Success Criteria
- [x] No Pause/Cancel buttons
- [x] No notifications icon
- [x] Trainer image shows at 25%, 50%, 75% milestones
- [x] Rep counter hidden when trainer shows
- [x] Time labels on progress bar
- [x] Bottom indicator bar
- [x] Matches 05.png + 06.png exactly

**Effort:** 1.5 hours
