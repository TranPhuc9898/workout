---
phase: 02
title: "IntroScreen Implementation"
status: pending
priority: P1
effort: 30min
created: 2026-02-03
---

# Phase 02: IntroScreen Implementation

## Context

- **Parent Plan:** [plan.md](plan.md)
- **Previous Phase:** [Phase 01 - Setup](phase-01-setup-file-structure.md)
- **Design Reference:** `01.png` (Screen 01 - Coach Greeting)
- **Research:** [UI Analysis Report](../reports/ui-analysis-260203-0033-design-vs-implementation-gap.md) lines 11-30

---

## Overview

**Date:** 2026-02-03
**Description:** Implement Screen 01 - Alan greeting + "Start" button
**Priority:** 🔴 Critical
**Status:** Pending
**Estimated time:** 30 minutes

---

## Key Insights

1. Simplest screen in app (minimal UI, no complex state)
2. Uses existing AnimatedBubble component (reusable)
3. Trainer avatar from assets already exists (trainer-alan.png)
4. Speech bubble: "Hey, I am Alan, your trainer, now let's get to work!"
5. Single navigation action: "Start" button → MainScreen

---

## Requirements

### Functional
- Display Alan avatar centered
- Show speech bubble with greeting text
- "Start" button navigates to MainScreen
- Appears as initial screen (set in Phase 01)

### Non-Functional
- Match design pixel-perfect (01.png)
- Clean minimal layout (no other UI elements)
- Button press feels responsive (TouchableOpacity)
- Use existing fonts, colors, components

---

## Architecture

### Component Structure
```
IntroScreen
├── SafeAreaView (container)
├── View (content wrapper)
│   ├── AnimatedBubble (greeting text)
│   ├── Image (Alan avatar)
│   └── TouchableOpacity ("Start" button)
└── BottomIndicatorBar (decorative)
```

### State Management
- No local state needed (static screen)
- Navigation prop from React Navigation
- No AsyncStorage (show every time for MVP)

---

## Related Code Files

### To Modify
- `src/screens/intro-screen-coach-greeting.js` (replace boilerplate from Phase 01)

### Dependencies
- `src/components/AnimatedBubble.js` (reuse)
- `src/components/bottom-indicator-bar.js` (from Phase 01)
- `assets/images/trainer-alan.png` (verify exists)

---

## Implementation Steps

### Step 1: Design Analysis (from 01.png)

**Layout breakdown:**
- Background: #F3F6FB (light gray)
- Speech bubble: Top 20% of screen
- Avatar: Center, ~200x200px
- Button: Bottom 20% of screen, ~80% width
- Bottom indicator: 30px from bottom

**Spacing:**
- Bubble to avatar: 40px margin
- Avatar to button: 60px margin
- Button to indicator: 40px margin

---

### Step 2: Implement IntroScreen

**Full implementation:**
```javascript
// src/screens/intro-screen-coach-greeting.js
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AnimatedBubble from '../components/AnimatedBubble';
import BottomIndicatorBar from '../components/bottom-indicator-bar';

const { width, height } = Dimensions.get('window');

export default function IntroScreen({ navigation }) {
  const handleStart = () => {
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Greeting bubble */}
        <View style={styles.bubbleContainer}>
          <AnimatedBubble
            quote="Hey, I am Alan, your trainer, now let's get to work!"
            style={styles.bubble}
          />
        </View>

        {/* Alan avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/images/trainer-alan.png')}
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>

        {/* Start button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom indicator */}
      <BottomIndicatorBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bubbleContainer: {
    width: width * 0.85,
    alignItems: 'center',
  },
  bubble: {
    marginTop: 20,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    width: width * 0.8,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#7C4DFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Overpass-Bold',
  },
});
```

---

### Step 3: Verify AnimatedBubble Props

**Check if AnimatedBubble accepts custom quote:**
- Read `src/components/AnimatedBubble.js`
- If it only uses internal quotes array, modify to accept prop
- Ensure `quote` prop renders correctly

**Potential modification needed:**
```javascript
// AnimatedBubble.js - add prop support
export default function AnimatedBubble({ quote, style }) {
  return (
    <View style={[styles.bubble, style]}>
      <Text style={styles.text}>{quote}</Text>
      <View style={styles.tail} />
    </View>
  );
}
```

---

### Step 4: Handle Missing Avatar Image

**Check if trainer-alan.png exists:**
```bash
ls assets/images/trainer-alan.png
```

**If missing, use fallback:**
```javascript
// Option 1: Use trainer.png (generic)
source={require('../../assets/images/trainer.png')}

// Option 2: Use placeholder circle with text
<View style={styles.avatarPlaceholder}>
  <Text style={styles.placeholderText}>ALAN</Text>
</View>
```

---

### Step 5: Test IntroScreen

**Manual testing:**
1. Launch app → IntroScreen appears first
2. Verify speech bubble displays correct text
3. Verify Alan avatar centered and sized correctly
4. Tap "Start" button → navigates to MainScreen
5. Press back (Android) → returns to IntroScreen
6. Check console for errors

**Visual QA (compare with 01.png):**
- [ ] Bubble text matches design
- [ ] Avatar size ~200x200px
- [ ] Button purple #7C4DFF with shadow
- [ ] Bottom indicator visible
- [ ] Clean minimal layout (no extra elements)

---

## Todo Checklist

- [ ] Implement IntroScreen full layout
- [ ] Verify AnimatedBubble accepts `quote` prop (modify if needed)
- [ ] Check trainer-alan.png exists (use fallback if missing)
- [ ] Test navigation: IntroScreen → MainScreen
- [ ] Compare layout with 01.png (pixel-perfect check)
- [ ] Test button press feedback (activeOpacity works)
- [ ] Verify fonts load correctly (Overpass-Bold)
- [ ] Test on both iOS and Android (if possible)

---

## Success Criteria

- ✅ IntroScreen shows as initial screen on app launch
- ✅ Speech bubble: "Hey, I am Alan, your trainer, now let's get to work!"
- ✅ Alan avatar centered, ~200x200px
- ✅ "Start" button navigates to MainScreen
- ✅ Layout matches 01.png pixel-perfect
- ✅ No console errors or warnings

---

## Risk Assessment

### Potential Issues
1. **AnimatedBubble doesn't accept custom quote**
   - Mitigation: Modify component to accept `quote` prop
2. **trainer-alan.png missing from assets**
   - Mitigation: Use trainer.png or create placeholder
3. **Navigation breaks existing flow**
   - Mitigation: Test all routes (Intro → Main → Settings → Workout)
4. **Fonts not loading on IntroScreen**
   - Mitigation: Verify useFonts in App.js loads before render

### Testing Strategy
- Test with fresh app install (clear AsyncStorage)
- Test back navigation (Android hardware back button)
- Test on different screen sizes (small phone vs tablet)

---

## Security Considerations

- No user input (no XSS risk)
- No data persistence (no storage risk)
- No external API calls
- Simple navigation (no deep linking vulnerabilities)

---

## Next Steps

**Dependencies for next phases:**
- Phase 03 (ProgressScreen) can start in parallel
- Phase 04 (BottomSheet) needs navigation to ProgressScreen
- Phase 05 (MainScreen) needs IntroScreen to test flow

**After completion:**
- User can launch app and see professional greeting
- Flow: IntroScreen → "Start" → MainScreen (tap to start)
- Proceed to Phase 03 or Phase 05 (parallel work possible)
