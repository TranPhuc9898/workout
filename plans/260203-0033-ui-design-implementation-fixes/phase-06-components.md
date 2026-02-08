# Phase 06: Components

## 1. BottomIndicatorBar Component

### Design
- Horizontal bar: 4-6px height, 100-120px width
- Centered horizontally
- 20-30px from bottom
- Color: #CFCFE2 or #7C4DFF

### Create `src/components/BottomIndicatorBar.js`
```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';

const BottomIndicatorBar = ({ color = '#CFCFE2' }) => {
  return <View style={[styles.indicator, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  indicator: {
    width: 120,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 25,
  },
});

export default BottomIndicatorBar;
```

---

## 2. HorizontalProgressBar Time Labels

### Design (05.png)
- Left label: "0:00"
- Right label: Total duration (e.g. "2:43")

### Update `src/components/HorizontalProgressBar.js`
Add props + labels:

```javascript
const HorizontalProgressBar = ({ durationInSec, isPaused, delayInSec, showTimeLabels = false }) => {
  // ... existing code ...

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {showTimeLabels && (
        <View style={styles.labelsContainer}>
          <Text style={styles.timeLabel}>0:00</Text>
          <Text style={styles.timeLabel}>{formatTime(durationInSec)}</Text>
        </View>
      )}
      
      {/* Existing progress bar */}
      <Animated.View style={[styles.progressBar, animatedStyle]} />
    </View>
  );
};

// Add styles:
const styles = StyleSheet.create({
  container: {
    width: '80%',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: 'Overpass',
    color: '#81809E',
  },
  // ... existing styles ...
});
```

## Success Criteria
- [x] BottomIndicatorBar shows on all screens
- [x] HorizontalProgressBar shows "0:00" and total time
- [x] Both components reusable
- [x] Match design styling

**Effort:** 30 min
