---
phase: 4
title: Fix AnimatedBubble Broken Audio
status: pending
priority: medium
effort: small
depends_on: [1]
---

# Phase 4: Fix AnimatedBubble Broken Audio

## Overview
Fix broken audio in `AnimatedBubble.js` — currently passes string filenames to `Audio.Sound.createAsync()` which requires `require()` sources or URIs.

## Context
- `AnimatedBubble.js:16` — `Audio.Sound.createAsync(quote.audio)` receives strings like `"great_job_1.mp3"`
- These .mp3 files don't exist anywhere in the project
- `WorkoutScreen.js` passes `quote.audio` as string: `"give_me_everything_1.mp3"`, etc.
- The Simon recordings folder has motivational phrases that can replace these

## Problem
```js
// WorkoutScreen.js line 36
const startQuote = { text: "Give me everything...", audio: "give_me_everything_1.mp3" };
// AnimatedBubble.js line 16 — FAILS: string is not a valid source
const { sound } = await Audio.Sound.createAsync(quote.audio);
```

## Solution
Replace string audio references with `require()` sources from sound registry.

### Option A: Map milestone quotes to existing recordings (Recommended)
Map each milestone to the closest matching motivational recording:

| Milestone | Current string | Map to recording |
|-----------|---------------|-----------------|
| Start (delay) | `give_me_everything_1.mp3` | `you-ve-got-this-{random}.wav` |
| 25% | `great_job_keep_pushing_1.mp3` | `keep-pushing-{random}.wav` |
| 50% | `halfway_through_1.mp3` | `keep-up-the-hard-work-{random}.wav` |
| 75% | `almost_done_1.mp3` | `you-re-almost-there-{random}.wav` |
| Complete | `great_job_1.mp3` | `great-job-keep-it-up-{random}.wav` or `finish-strong-{random}.wav` |

### Implementation Steps

1. Add milestone sound mappings to `sound-registry.js`:
```js
export const MILESTONE_SOUNDS = {
  start: [
    require('../../assets/sounds/motivational/rep-phase/you-ve-got-this-1.wav'),
    require('../../assets/sounds/motivational/rep-phase/you-ve-got-this-2.wav'),
  ],
  quarter: [
    require('../../assets/sounds/motivational/rep-phase/keep-pushing-1.wav'),
    require('../../assets/sounds/motivational/rep-phase/keep-pushing-2.wav'),
  ],
  half: [
    require('../../assets/sounds/motivational/rep-phase/keep-up-the-hard-work-1.wav'),
    require('../../assets/sounds/motivational/rep-phase/keep-up-the-hard-work-2.wav'),
  ],
  threeQuarter: [
    require('../../assets/sounds/motivational/rep-phase/you-re-almost-there-1.wav'),
    require('../../assets/sounds/motivational/rep-phase/you-re-almost-there-2.wav'),
  ],
  complete: [
    require('../../assets/sounds/motivational/rep-phase/finish-strong-1.wav'),
    require('../../assets/sounds/motivational/rep-phase/great-job-keep-it-up-1.wav'),
  ],
};
```

2. Update `WorkoutScreen.js` quote objects to use `require()` sources:
```js
import { MILESTONE_SOUNDS } from '../data/sound-registry';

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const startQuote = { text: "Give me everything you got!", audio: pickRandom(MILESTONE_SOUNDS.start) };
const quarterQuote = { text: "Great job! Keep pushing!", audio: pickRandom(MILESTONE_SOUNDS.quarter) };
// etc.
```

3. `AnimatedBubble.js` — no code changes needed! `Audio.Sound.createAsync()` accepts `require()` sources natively.

4. Remove `trainerId`-based audio string construction (lines 23-39 in WorkoutScreen.js).

## Success Criteria
- [ ] Milestone speech bubbles play actual audio at 25/50/75/100%
- [ ] Start quote plays audio during delay period
- [ ] Completion quote plays audio
- [ ] Random take selection adds variety
- [ ] No console errors from audio loading
