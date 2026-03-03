# Phase 4: Settings Toggle + StatusBar

## Priority: MEDIUM | Status: completed

## Overview

Add dark mode toggle switch in gear-settings-screen.js and handle StatusBar appearance.

## Files to Modify

- `src/screens/gear-settings-screen.js` — add toggle row
- `App.js` — add StatusBar component with dynamic barStyle

## Implementation Steps

### 1. Dark Mode Toggle in Settings

Add a new menu item at top of MENU_ITEMS or as a separate toggle row:

```js
// Above the menu list, add a toggle row:
<View style={styles.toggleRow}>
  <View style={styles.menuLeft}>
    <View style={styles.iconCircle}>
      <Ionicons name="moon-outline" size={20} color={theme.colors.primary} />
    </View>
    <Text style={styles.menuLabel}>Dark Mode</Text>
  </View>
  <Switch
    value={isDarkMode}
    onValueChange={(val) => setIsDarkMode(val)}
    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
    thumbColor={theme.colors.white}
  />
</View>
```

### 2. StatusBar in App.js

```js
import { StatusBar } from 'react-native';

// Inside App component, use context:
<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
```

### 3. Navigation Theme (optional but recommended)

Set `NavigationContainer` theme for screen transitions:

```js
const navTheme = {
  dark: isDarkMode,
  colors: {
    primary: '#7C4DFF',
    background: isDarkMode ? '#0D0D0D' : '#FFFFFF',
    card: isDarkMode ? '#1A1A2E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    border: isDarkMode ? '#2A2A3C' : '#CFCFE2',
    notification: '#7C4DFF',
  },
};

<NavigationContainer theme={navTheme}>
```

## Success Criteria

- [x] Dark mode toggle visible in Settings screen
- [x] Toggle persists across app restarts
- [x] StatusBar text color adapts to theme
- [x] Smooth transition when toggling (no flash)

## Files Completed

- src/screens/gear-settings-screen.js — dark mode toggle UI
- App.js — StatusBar + navigation theme
