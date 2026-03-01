---
phase: 2
title: Audio Manager Service
status: pending
priority: high
effort: medium
depends_on: [1]
---

# Phase 2: Audio Manager Service

## Overview
Create `src/services/workout-audio-manager.js` — centralized audio playback with priority queue, preloading, and progressive motivational scheduling.

## Context
- Uses `expo-av` Audio API (already installed)
- Must handle: rep sounds (priority), motivational (interruptible), cleanup
- Progressive frequency: motivational chance increases as set progresses
- File: `src/services/workout-audio-manager.js` (new file, ~150 lines)

## Architecture

```
WorkoutAudioManager
├── preload(maxRep)          → load rep sounds + random motivational pool
├── playRepSound(repNum)     → immediate, stops any motivational playing
├── playMotivational(type)   → 'rep-phase' or 'break-phase', interruptible
├── shouldPlayMotivational(currentRep, totalReps) → progressive probability
├── cleanup()                → unload all sounds
└── Internal
    ├── currentSound         → ref to currently playing sound
    ├── preloadedReps        → Map<number, Audio.Sound>
    └── motivationalPool     → { repPhase: Sound[], breakPhase: Sound[] }
```

## Implementation

### Core API

```js
import { Audio } from 'expo-av';
import { REP_SOUNDS, REP_PHASE_MOTIVATIONAL, BREAK_PHASE_MOTIVATIONAL } from '../data/sound-registry';

class WorkoutAudioManager {
  constructor() {
    this.currentSound = null;
    this.preloadedReps = new Map();
    this.motivationalPool = { repPhase: [], breakPhase: [] };
    this.isPlaying = false;
  }

  async init() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }

  async preload(maxRep) {
    // Preload rep sounds 1..maxRep
    for (let i = 1; i <= maxRep; i++) {
      if (REP_SOUNDS[i]) {
        const { sound } = await Audio.Sound.createAsync(REP_SOUNDS[i]);
        this.preloadedReps.set(i, sound);
      }
    }
    // Preload random subset of motivational (5 rep-phase, 3 break-phase)
    await this._preloadMotivationalPool();
  }

  async playRepSound(repNumber) {
    // Priority: stop any current sound first
    await this._stopCurrent();
    const sound = this.preloadedReps.get(repNumber);
    if (sound) {
      await sound.replayAsync();
      this.currentSound = sound;
    }
  }

  async playMotivational(type = 'rep-phase') {
    if (this.isPlaying) return; // don't interrupt rep sounds
    const pool = type === 'break-phase'
      ? this.motivationalPool.breakPhase
      : this.motivationalPool.repPhase;
    if (pool.length === 0) return;
    const sound = pool[Math.floor(Math.random() * pool.length)];
    this.currentSound = sound;
    this.isPlaying = true;
    await sound.replayAsync();
    // Listen for completion
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) this.isPlaying = false;
    });
  }

  shouldPlayMotivational(currentRep, totalReps) {
    if (totalReps <= 0) return false;
    const progress = currentRep / totalReps;
    let chance;
    if (progress <= 0.25) chance = 0.2;
    else if (progress <= 0.5) chance = 0.4;
    else if (progress <= 0.75) chance = 0.6;
    else chance = 0.8;
    return Math.random() < chance;
  }

  async cleanup() {
    await this._stopCurrent();
    for (const sound of this.preloadedReps.values()) {
      await sound.unloadAsync();
    }
    for (const sound of this.motivationalPool.repPhase) {
      await sound.unloadAsync();
    }
    for (const sound of this.motivationalPool.breakPhase) {
      await sound.unloadAsync();
    }
    this.preloadedReps.clear();
    this.motivationalPool = { repPhase: [], breakPhase: [] };
  }

  // Private
  async _stopCurrent() {
    if (this.currentSound) {
      try { await this.currentSound.stopAsync(); } catch {}
      this.isPlaying = false;
    }
  }

  async _preloadMotivationalPool() {
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    const repSources = shuffle(REP_PHASE_MOTIVATIONAL).slice(0, 5);
    const breakSources = shuffle(BREAK_PHASE_MOTIVATIONAL).slice(0, 3);
    for (const src of repSources) {
      const { sound } = await Audio.Sound.createAsync(src);
      this.motivationalPool.repPhase.push(sound);
    }
    for (const src of breakSources) {
      const { sound } = await Audio.Sound.createAsync(src);
      this.motivationalPool.breakPhase.push(sound);
    }
  }
}

export default WorkoutAudioManager;
```

### Key Design Decisions
- **Preload only what's needed**: rep 1→maxRep + 5 random motivational (not all 113)
- **`replayAsync()`** instead of `playAsync()`: resets position for preloaded sounds
- **`_stopCurrent()`** before rep sound: ensures no overlap, rep always wins
- **`isPlaying` flag**: prevents motivational from interrupting rep sounds
- **Shuffle pool**: different motivational each workout session

## Success Criteria
- [ ] `WorkoutAudioManager` class created with init/preload/play/cleanup
- [ ] Rep sounds play immediately with priority over motivational
- [ ] Progressive probability logic works correctly
- [ ] Proper cleanup on unmount (no memory leaks)
- [ ] No audio overlap between rep and motivational sounds
