---
status: completed
created: 2026-03-04
slug: dark-mode
---

# Dark Mode Implementation Plan

## Summary

Add dark mode toggle to the workout app while preserving purple `#7C4DFF` as primary accent. User toggles in Settings, preference persisted via AsyncStorage.

## Current State

- Theme centralized in `src/theme/colors.js` (14 tokens, light only)
- All components use `theme.colors.xxx` via static import
- `StyleSheet.create` at module level — **must convert to dynamic**
- SettingsContext exists with AsyncStorage persistence
- ~20 hardcoded hex values scattered across screens

## Approach

**Pattern:** `useTheme()` hook + styles factory with `useMemo`

```
Before: import theme from '../theme'; + module-level StyleSheet
After:  const theme = useTheme(); + useMemo(() => createStyles(theme), [theme])
```

## Color Palette

| Token | Light | Dark |
|---|---|---|
| primary | #7C4DFF | #7C4DFF |
| background | #FFFFFF | #0D0D0D |
| backgroundSecondary | #F3F6FB | #1A1A2E |
| backgroundTertiary | #EEEEEE | #252538 |
| textPrimary | #000000 | #FFFFFF |
| textSecondary | #81809E | #A0A0B8 |
| textMuted | #9C9BC2 | #6B6B8A |
| textDark | #1E1E22 | #E0E0E0 |
| border | #CFCFE2 | #2A2A3C |
| borderLight | #EEEEEE | #1E1E2E |
| progressGray | #8A9A9D | #3A3A4C |
| breakAccent | #F4D300 | #F4D300 |
| white | #FFFFFF | #FFFFFF |
| black | #000000 | #000000 |

## Phases

| # | Phase | Files | Status |
|---|---|---|---|
| 1 | [Theme Infrastructure](./phase-01-theme-infrastructure.md) | 4 files | completed |
| 2 | [Update Components](./phase-02-update-components.md) | 9 files | completed |
| 3 | [Update Screens](./phase-03-update-screens.md) | 12 files | completed |
| 4 | [Settings Toggle + StatusBar](./phase-04-settings-toggle.md) | 2 files | completed |

## Dependencies

Phase 1 → Phase 2 & 3 (parallel) → Phase 4

## Risk Assessment

- **Low:** Theme tokens already centralized
- **Medium:** ~20 hardcoded colors need manual replacement
- **Medium:** `@react-native-picker/picker` item styles may not support dynamic colors well on iOS
- **Low:** No breaking changes to navigation or data flow
