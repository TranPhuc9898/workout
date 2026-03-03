# Phase 1: Theme Infrastructure

## Priority: HIGH | Status: completed

## Overview

Create the foundational theme system that supports light/dark color maps, a React context provider, and a `useTheme()` hook.

## Files to Modify

- `src/theme/colors.js` — add `lightColors` and `darkColors` exports
- `src/theme/index.js` — export `getTheme(isDark)` function
- `src/SettingsContext.js` — add `isDarkMode` state + AsyncStorage persist

## Files to Create

- `src/hooks/use-theme.js` — custom hook returning resolved theme object

## Implementation Steps

### 1. Update `src/theme/colors.js`

```js
// Keep existing colors as lightColors
export const lightColors = {
  primary: '#7C4DFF',
  background: '#FFFFFF',
  backgroundSecondary: '#F3F6FB',
  backgroundTertiary: '#EEEEEE',
  textPrimary: '#000000',
  textSecondary: '#81809E',
  textMuted: '#9C9BC2',
  textDark: '#1E1E22',
  border: '#CFCFE2',
  borderLight: '#EEEEEE',
  white: '#FFFFFF',
  black: '#000000',
  progressGray: '#8A9A9D',
  breakAccent: '#F4D300',
};

export const darkColors = {
  primary: '#7C4DFF',
  background: '#0D0D0D',
  backgroundSecondary: '#1A1A2E',
  backgroundTertiary: '#252538',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B8A',
  textDark: '#E0E0E0',
  border: '#2A2A3C',
  borderLight: '#1E1E2E',
  white: '#FFFFFF',
  black: '#000000',
  progressGray: '#3A3A4C',
  breakAccent: '#F4D300',
};

// Backward compat: default export = light
export const colors = lightColors;
export default colors;
```

### 2. Update `src/theme/index.js`

```js
import { lightColors, darkColors } from './colors';
import fonts from './fonts';
import spacing from './spacing';

export const getTheme = (isDark = false) => ({
  colors: isDark ? darkColors : lightColors,
  fonts,
  spacing,
  isDark,
});

// Backward compat
export const theme = getTheme(false);
export default theme;
```

### 3. Update `src/SettingsContext.js`

Add `isDarkMode` state alongside existing settings:
- Default: `false`
- Load from AsyncStorage key `'isDarkMode'`
- Expose `isDarkMode` and `setIsDarkMode` in context value
- Persist on change via `saveSettings`

### 4. Create `src/hooks/use-theme.js`

```js
import { useContext, useMemo } from 'react';
import { SettingsContext } from '../SettingsContext';
import { getTheme } from '../theme';

export const useTheme = () => {
  const { isDarkMode } = useContext(SettingsContext);
  return useMemo(() => getTheme(isDarkMode), [isDarkMode]);
};
```

## Success Criteria

- [x] `lightColors` and `darkColors` exported from colors.js
- [x] `getTheme(isDark)` returns correct color set
- [x] `useTheme()` hook returns dynamic theme based on context
- [x] `isDarkMode` persisted in AsyncStorage
- [x] Backward compat: `import theme from '../theme'` still works (returns light)

## Files Completed

- `src/theme/colors.js` — lightColors & darkColors objects
- `src/theme/index.js` — getTheme(isDark) function
- `src/SettingsContext.js` — isDarkMode state + AsyncStorage
- `src/hooks/use-theme.js` — useTheme() hook
