# Phase 3: Update Screens

## Priority: HIGH | Status: completed

## Overview

Convert all 12 screen files from static theme import to dynamic `useTheme()`. Fix all hardcoded hex colors.

## Files to Update (12)

### 1. `src/screens/IntroScreen.js`
- Theme refs: `background`, `white`, `black`, `textSecondary`, `primary`
- Avatar border shadow color needs dark variant

### 2. `src/screens/MainScreen.js`
- Theme refs: `background`, `textSecondary`, `primary`
- **Hardcoded:** `#F0EFF5` in gifRing → use `backgroundTertiary`
- Picker item colors need dynamic update

### 3. `src/screens/WorkoutScreen.js` (380 lines)
- Heavy theme usage: `background`, `primary`, `textMuted`, `white`
- Move styles factory, careful with animated values

### 4. `src/screens/ProgressScreen.js` (301 lines)
- Heavy theme usage (~20 refs)
- Category badges, exercise cards, filter pills

### 5. `src/screens/SettingsScreen.js`
- **Hardcoded colors:**
  - `backgroundColor: '#fff'` → `theme.colors.background`
  - `color: '#81809E'` → `theme.colors.textSecondary`
  - `borderColor: '#CDCDE0'` → `theme.colors.border`

### 6. `src/screens/gear-settings-screen.js`
- **Hardcoded colors:**
  - `backgroundColor: '#fff'` → `theme.colors.background`
  - `borderBottomColor: '#F0F0F5'` → `theme.colors.borderLight`
  - `backgroundColor: '#F3F0FF'` → new token or computed from primary

### 7. `src/screens/workout-buddy-screen.js`
- **Hardcoded:** `#fff`, `#F3F6FB`, `#CDCDE0`

### 8. `src/screens/buddy-invite-screen.js`
- **Hardcoded:** `#fff`, `#F3F6FB`

### 9. `src/screens/terms-of-use-screen.js`
- **Hardcoded:** `backgroundColor: '#fff'`

### 10. `src/screens/privacy-policy-screen.js`
- **Hardcoded:** `backgroundColor: '#fff'`

### 11. `src/screens/about-screen.js`
- **Hardcoded:** `backgroundColor: '#fff'`

### 12. `src/screens/workout-detail-screen.js`
- Check and update theme usage

## Hardcoded Color Map

| Hardcoded | Replace With |
|---|---|
| `'#fff'` / `'#FFFFFF'` | `theme.colors.background` |
| `'#F3F6FB'` | `theme.colors.backgroundSecondary` |
| `'#EEEEEE'` / `'#F0EFF5'` / `'#F0F0F5'` | `theme.colors.backgroundTertiary` |
| `'#81809E'` | `theme.colors.textSecondary` |
| `'#CDCDE0'` / `'#CFCFE2'` | `theme.colors.border` |
| `'#F3F0FF'` | `theme.colors.primaryLight` (new token needed) |

## New Token Needed

Add `primaryLight` to both color maps:
- Light: `#F3F0FF` (light purple tint for icon circles)
- Dark: `#2A1F4E` (dark purple tint)

## Success Criteria

- [x] All 12 screens use `useTheme()` hook
- [x] Zero hardcoded hex colors in screen files
- [x] All screens render correctly in both modes

## Files Completed

1. src/screens/IntroScreen.js
2. src/screens/MainScreen.js
3. src/screens/WorkoutScreen.js
4. src/screens/ProgressScreen.js
5. src/screens/SettingsScreen.js
6. src/screens/gear-settings-screen.js
7. src/screens/workout-buddy-screen.js
8. src/screens/buddy-invite-screen.js
9. src/screens/terms-of-use-screen.js
10. src/screens/privacy-policy-screen.js
11. src/screens/about-screen.js
12. src/screens/workout-detail-screen.js
