---
status: pending
created: 2026-02-26
slug: voice-rep-counting
title: Voice Rep Counting + Motivational Audio System
phases: 4
estimated_effort: medium
---

# Voice Rep Counting + Motivational Audio System

## Overview
Add real-time voice rep counting and progressive motivational audio to the workout experience. Uses existing 165 .wav recordings from `Simon_s Gym App Recordings/` folder.

## Context
- Brainstorm report: `plans/reports/brainstorm-260226-0148-voice-rep-counting.md`
- Key files: `src/screens/WorkoutScreen.js`, `src/components/AnimatedBubble.js`
- Audio lib: `expo-av` (installed, v14.0.7)
- Voice files: 51 numbered (0-50.wav) + 113 motivational phrases (28 categories x 3-5 takes)
- Total folder size: 152MB (.wav) — needs optimization

## Phases

| # | Phase | Status | Files |
|---|-------|--------|-------|
| 1 | Organize audio assets + require map | pending | `assets/sounds/`, `src/data/sound-registry.js` |
| 2 | Audio manager service | pending | `src/services/workout-audio-manager.js` |
| 3 | Integrate into WorkoutScreen | pending | `src/screens/WorkoutScreen.js` |
| 4 | Fix AnimatedBubble broken audio | pending | `src/components/AnimatedBubble.js` |

## Key Decisions
- Keep .wav format (expo-av handles it fine; conversion adds build complexity)
- Use `require()` static mapping (Expo/Metro needs static requires, no dynamic paths)
- Progressive motivational: 20% → 40% → 60% → 80% chance as set progresses
- Audio priority: rep sounds always interrupt motivational
- Categorize motivational by context (rep-phase vs break-phase)

## Dependencies
- Phase 2 depends on Phase 1 (needs sound registry)
- Phase 3 depends on Phase 2 (needs audio manager)
- Phase 4 is independent

## Risks
- **152MB .wav folder**: All files bundled into app binary. Consider `.gitignore`-ing the zip (45MB). Only needed .wav files get bundled via `require()`.
- **Metro require()**: Must be static strings, no dynamic `require(variable)`. Need a mapping object.
