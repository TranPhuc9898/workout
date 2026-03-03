# Phase 2: Update Components

## Priority: HIGH | Status: completed

## Overview

Convert all 9 component files from static `import theme` to dynamic `useTheme()` hook. Move `StyleSheet.create` into factory functions.

## Pattern

```js
// BEFORE
import theme from '../theme';
const MyComp = () => { ... };
const styles = StyleSheet.create({ container: { backgroundColor: theme.colors.background } });

// AFTER
import { useMemo } from 'react';
import { useTheme } from '../hooks/use-theme';
const MyComp = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  ...
};
const createStyles = (theme) => StyleSheet.create({ container: { backgroundColor: theme.colors.background } });
```

## Files to Update (9)

### 1. `src/components/screen-header.js`
- Replace `import theme` → `useTheme()`
- Move styles into `createStyles(theme)`
- Lines using theme: badge bg, icon colors, title color

### 2. `src/components/CircularProgressBar.js`
- Uses `theme.colors.primary`, `breakAccent`, `border`
- Dynamic ring color logic already exists (isInBreak toggle)
- Move to factory pattern

### 3. `src/components/AnimatedBubble.js`
- Uses `backgroundTertiary`, `primary` text color
- Move to factory pattern

### 4. `src/components/HorizontalProgressBar.js`
- Uses `primary` fill, `progressGray` bg
- Move to factory pattern

### 5. `src/components/BottomSheet.js`
- Uses `background`, `backgroundSecondary`, `primary`, `textPrimary`, `textMuted`, `border`
- Fix hardcoded colors in `text` style (missing color property — will inherit)
- Move to factory pattern

### 6. `src/components/BottomIndicatorBar.js`
- Check for theme usage, update if needed

### 7. `src/components/Progress.js`
- Check for theme usage, update if needed

### 8. `src/components/expandable-exercise-card.js`
- Heavy theme usage (~15 references)
- Move to factory pattern

### 9. `src/components/tap-to-start-speech-bubble-button.js`
- Uses `backgroundTertiary`, `primary`
- Move to factory pattern

## Success Criteria

- [x] All 9 components use `useTheme()` hook
- [x] No static `import theme` in component files
- [x] All hardcoded colors replaced with theme tokens
- [x] Components re-render correctly on theme change

## Files Completed

1. src/components/screen-header.js
2. src/components/CircularProgressBar.js
3. src/components/AnimatedBubble.js
4. src/components/HorizontalProgressBar.js
5. src/components/BottomSheet.js
6. src/components/BottomIndicatorBar.js
7. src/components/Progress.js
8. src/components/expandable-exercise-card.js
9. src/components/tap-to-start-speech-bubble-button.js
