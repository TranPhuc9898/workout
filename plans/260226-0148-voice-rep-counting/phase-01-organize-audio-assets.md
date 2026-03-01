---
phase: 1
title: Organize Audio Assets + Require Map
status: pending
priority: high
effort: small
---

# Phase 1: Organize Audio Assets + Require Map

## Overview
Move voice recordings into `assets/sounds/` with clean naming, create static `require()` registry for Metro bundler.

## Context
- Source: `Simon_s Gym App Recordings/` (152MB, 165 .wav files)
- Metro bundler requires static `require('path')` — no dynamic paths
- Max reps in app: 30 (settings allow 5-30), but files go 0-50

## Requirements

### File Organization
```
assets/sounds/
├── reps/
│   ├── 0.wav → 50.wav        (51 files, rep counting)
└── motivational/
    ├── rep-phase/             (encouraging during reps)
    │   ├── every-rep-counts-1.wav
    │   ├── keep-pushing-1.wav
    │   ├── feel-the-burn-1.wav
    │   ├── push-through-the-pain-1.wav
    │   ├── you-ve-got-this-1.wav
    │   ├── dig-deep-1.wav
    │   ├── one-more-rep-1.wav
    │   ├── stay-focused-1.wav
    │   ├── keep-good-form-1.wav
    │   ├── you-re-stronger-than-you-think-1.wav
    │   ├── believe-in-yourself-1.wav
    │   ├── you-re-unstoppable-1.wav
    │   ├── don-t-give-up-now-1.wav
    │   ├── keep-the-energy-up-1.wav
    │   └── ... (multiple takes per phrase)
    └── break-phase/           (rest/recovery focused)
        ├── take-deep-breaths-1.wav
        ├── take-a-moment-1.wav
        ├── hydration-1.wav
        ├── refuel-1.wav
        ├── keep-walking-around-1.wav
        ├── listen-to-your-body-1.wav
        └── ... (multiple takes per phrase)
```

### Motivational Categorization

**Rep-phase** (encouraging, push harder):
- Every Rep Counts, Keep Pushing, Feel The Burn, Push Through The Pain
- You've Got This, Dig Deep, One More Rep, Stay Focused, Keep Good Form
- You're Stronger Than You Think, Believe In Yourself, You're Unstoppable
- Don't Give Up Now, Keep The Energy Up, Keep Up The Hard Work
- Stay Committed, Stay Focused On Your Goals, You're Doing Amazing
- You're Making Amazing Progress, Great Job Keep It Up, Finish Strong
- You're Almost There

**Break-phase** (rest, recover):
- Take Deep Breaths, Take A Moment, Hydration, Refuel
- Keep Walking Around, Listen To Your Body

### Sound Registry (`src/data/sound-registry.js`)

Static `require()` map. Metro resolves at build time.

```js
// Rep sounds - keyed by rep number
export const REP_SOUNDS = {
  1: require('../../assets/sounds/reps/1.wav'),
  2: require('../../assets/sounds/reps/2.wav'),
  // ... up to 50
};

// Motivational - rep phase
export const REP_PHASE_MOTIVATIONAL = [
  require('../../assets/sounds/motivational/rep-phase/every-rep-counts-1.wav'),
  require('../../assets/sounds/motivational/rep-phase/keep-pushing-1.wav'),
  // ... all rep-phase files
];

// Motivational - break phase
export const BREAK_PHASE_MOTIVATIONAL = [
  require('../../assets/sounds/motivational/break-phase/take-deep-breaths-1.wav'),
  // ... all break-phase files
];
```

## Implementation Steps

1. Create directory structure: `assets/sounds/reps/`, `assets/sounds/motivational/rep-phase/`, `assets/sounds/motivational/break-phase/`
2. Copy numbered files (0-50.wav) to `assets/sounds/reps/`
3. Copy motivational files to appropriate category folders, renaming to kebab-case (e.g., `Keep Pushing - 1.wav` → `keep-pushing-1.wav`)
4. Create `src/data/sound-registry.js` with static require maps
5. Delete the zip file from recordings folder (45MB, not needed)
6. Add `Simon_s Gym App Recordings/` to `.gitignore` (source files, not needed in repo)

## Success Criteria
- [ ] All .wav files organized in `assets/sounds/`
- [ ] `sound-registry.js` exports REP_SOUNDS, REP_PHASE_MOTIVATIONAL, BREAK_PHASE_MOTIVATIONAL
- [ ] No dynamic `require()` — all paths are string literals
- [ ] App compiles without errors
