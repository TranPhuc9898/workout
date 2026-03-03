# Code Reviewer Memory

## Project: workout_app-main (React Native / Expo)

### Architecture
- Theme system: `src/theme/colors.js` -> `src/theme/index.js` (getTheme) -> `src/hooks/use-theme.js` (useTheme hook)
- Settings: `src/SettingsContext.js` with AsyncStorage persistence
- Pattern: `useTheme()` + `useMemo(() => createStyles(theme), [theme])` in every component/screen
- Navigation: React Navigation stack navigator, screens registered in `App.js`
- Fonts: Overpass family loaded via expo-font in App.js

### Key Files
- `App.js` -- Root, SettingsProvider wraps AppNavigator
- `src/SettingsContext.js` -- Global state (trainer, time, sounds, delay, isDarkMode)
- `src/theme/colors.js` -- lightColors + darkColors palettes
- `src/components/Progress.js` -- LEGACY/DEAD component, not imported anywhere, still has hardcoded colors

### Known Issues (as of 2026-03-04)
- isDarkMode init as `false` causes race with AsyncStorage load (can overwrite saved `true`)
- Theme flash on cold start for dark mode users
- `Progress.js` not converted to dark mode (likely dead code)
- No test files exist in the project
- Spacing tokens defined in theme but not used in any component

### Review Patterns
- Check `src/components/` and `src/screens/` for hardcoded hex colors
- Verify useMemo deps include `[theme]` for style factories
- SVG elements may use inline color strings that bypass theme
- Medal icons use hardcoded gold `#F5A623` -- intentional design choice
