# Phase 02: MainScreen

## Design (04.png)
- Top right: 3-dot menu icon (NOT settings, NOT notifications)
- "tap to start" bubble
- Big purple circle with flame
- Text: "Default setup for workout"
- Wheel pickers: "Set" "Rep" "Break(s)" (NOT "Sets" "Reps")
- NO "Name Your Workout" input
- Bottom indicator bar

## Current Code (`src/screens/MainScreen.js`)
❌ Settings icon (left)
❌ Notifications icon (right)
❌ "Name Your Workout" title + TextInput visible
❌ Labels: "Sets" "Reps" "Break(s)"
❌ No "Default setup" text
❌ No bottom indicator bar

## Changes Needed

### 1. Hide icons container (lines 95-102)
```javascript
// REMOVE or comment out entire iconsContainer View
// <View style={styles.iconsContainer}>
//   ...
// </View>
```

### 2. Add 3-dot menu (top right only)
```javascript
<View style={styles.menuContainer}>
  <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
    <Text style={styles.menuIcon}>⋮</Text>
  </TouchableOpacity>
</View>
```

Add styles:
```javascript
menuContainer: {
  position: 'absolute',
  top: 10,
  right: 20,
  zIndex: 1,
},
menuIcon: {
  fontSize: 28,
  color: '#81809E',
},
```

### 3. Hide "Name Your Workout" title + input (lines 115-127)
```javascript
// REMOVE:
// <Text style={styles.title}>Name Your Workout</Text>
// <TextInput ... />
```

### 4. Add "Default setup for workout" text
After logo, before pickers:
```javascript
<Text style={styles.defaultSetupText}>Default setup for workout</Text>
```

Style:
```javascript
defaultSetupText: {
  color: "#81809E",
  fontFamily: 'Overpass',
  fontSize: 14,
  marginTop: 10,
  marginBottom: 20,
},
```

### 5. Change picker labels (lines 131, 143, 155)
```javascript
// Change:
<Text style={styles.column}>Sets</Text> → <Text style={styles.column}>Set</Text>
<Text style={styles.column}>Reps</Text> → <Text style={styles.column}>Rep</Text>
// Keep: "Break(s)"
```

### 6. Add bottom indicator bar
Import component (create in Phase 06):
```javascript
import BottomIndicatorBar from '../components/BottomIndicatorBar';
```

Add before closing `</View>`:
```javascript
<BottomIndicatorBar />
```

## Success Criteria
- [x] Only 3-dot menu visible (top right)
- [x] No input field
- [x] "Default setup for workout" text shows
- [x] Labels: "Set" "Rep" "Break(s)"
- [x] Bottom indicator bar shows
- [x] Matches 04.png design exactly

**Effort:** 1 hour
