import { Audio } from 'expo-av';
import {
  REP_SOUNDS,
  REP_PHASE_MOTIVATIONAL,
  BREAK_PHASE_MOTIVATIONAL,
  HYDRATION_SOUNDS,
} from '../data/sound-registry';

// Centralized audio manager for workout voice counting + motivational phrases.
// Rule: NEVER interrupt audio mid-sentence. If something is playing, wait/skip.
class WorkoutAudioManager {
  constructor() {
    this.currentSound = null;
    this.preloadedReps = new Map();
    this.motivationalPool = { repPhaseShort: [], repPhaseLong: [], breakPhase: [] };
    this.hydrationSound = null;
    this.isPlaying = false;
    this._initialized = false;
  }

  // Set audio mode for iOS silent switch compatibility
  async init() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      this._initialized = true;
    } catch (error) {
      console.warn('[AudioManager] init failed:', error);
    }
  }

  // Preload rep sounds (1..maxRep) + random motivational subset
  async preload(maxRep) {
    if (!this._initialized) return;
    try {
      // Preload only the rep sounds needed for this workout
      for (let i = 1; i <= Math.min(maxRep, 50); i++) {
        if (REP_SOUNDS[i]) {
          const { sound } = await Audio.Sound.createAsync(REP_SOUNDS[i]);
          this.preloadedReps.set(i, sound);
        }
      }
      // Preload random motivational subset (5 rep-phase, 3 break-phase)
      await this._preloadMotivationalPool();
    } catch (error) {
      console.warn('[AudioManager] preload failed:', error);
    }
  }

  // Play rep number voice — skips if another sound is still playing (never cut mid-sentence)
  async playRepSound(repNumber) {
    if (!this._initialized) return;
    // Don't interrupt motivational/hydration mid-sentence — skip this rep voice
    if (this.isPlaying) return;
    try {
      const sound = this.preloadedReps.get(repNumber);
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.playAsync();
        this.currentSound = sound;
        this.isPlaying = true;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            this.isPlaying = false;
            this.currentSound = null;
          }
        });
      }
    } catch (error) {
      console.warn('[AudioManager] playRepSound failed:', error);
    }
  }

  // Play hydration reminder — called first when entering break phase
  async playHydration() {
    if (!this._initialized || this.isPlaying || !this.hydrationSound) return;
    try {
      await this.hydrationSound.setPositionAsync(0);
      await this.hydrationSound.playAsync();
      this.currentSound = this.hydrationSound;
      this.isPlaying = true;
      this.hydrationSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          this.isPlaying = false;
          this.currentSound = null;
        }
      });
    } catch (error) {
      console.warn('[AudioManager] playHydration failed:', error);
    }
  }

  // Play random motivational — interruptible, won't play if rep sound is active
  async playMotivational(type = 'rep-phase') {
    if (!this._initialized || this.isPlaying) return;
    try {
      const pool = type === 'break-phase'
        ? this.motivationalPool.breakPhase
        : this.motivationalPool.repPhase;
      if (pool.length === 0) return;

      const sound = pool[Math.floor(Math.random() * pool.length)];
      await sound.setPositionAsync(0);
      await sound.playAsync();
      this.currentSound = sound;
      this.isPlaying = true;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          this.isPlaying = false;
          this.currentSound = null;
        }
      });
    } catch (error) {
      console.warn('[AudioManager] playMotivational failed:', error);
    }
  }

  // Progressive probability — more motivational toward end of set
  // Reduced frequency to feel natural, not spammy
  // timeBetweenReps must be >= 5s (motivational needs time to finish speaking)
  shouldPlayMotivational(currentRep, totalReps, timeBetweenRepsInSec) {
    if (totalReps <= 0) return false;
    // Not enough time between reps for a full motivational phrase
    if (timeBetweenRepsInSec < 5) return false;
    // Play motivational every 4 reps (and on last rep)
    return currentRep % 4 === 0 || currentRep === totalReps;
  }

  // Stop whatever is currently playing
  async stopCurrent() {
    await this._stopCurrent();
  }

  // Unload all sounds and free memory
  async cleanup() {
    await this._stopCurrent();
    try {
      for (const sound of this.preloadedReps.values()) {
        sound.setOnPlaybackStatusUpdate(null);
        await sound.unloadAsync();
      }
      for (const sound of this.motivationalPool.repPhase) {
        sound.setOnPlaybackStatusUpdate(null);
        await sound.unloadAsync();
      }
      for (const sound of this.motivationalPool.breakPhase) {
        sound.setOnPlaybackStatusUpdate(null);
        await sound.unloadAsync();
      }
      if (this.hydrationSound) {
        this.hydrationSound.setOnPlaybackStatusUpdate(null);
        await this.hydrationSound.unloadAsync();
      }
    } catch (error) {
      console.warn('[AudioManager] cleanup error:', error);
    }
    this.preloadedReps.clear();
    this.motivationalPool = { repPhase: [], breakPhase: [] };
    this._initialized = false;
  }

  // --- Private ---

  async _stopCurrent() {
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
      } catch { /* already stopped */ }
      this.isPlaying = false;
      this.currentSound = null;
    }
  }

  async _preloadMotivationalPool() {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const repSources = shuffle(REP_PHASE_MOTIVATIONAL).slice(0, 5);
    const breakSources = shuffle(BREAK_PHASE_MOTIVATIONAL).slice(0, 3);

    // Always preload one hydration sound for break start
    try {
      const hydSrc = HYDRATION_SOUNDS[Math.floor(Math.random() * HYDRATION_SOUNDS.length)];
      const { sound } = await Audio.Sound.createAsync(hydSrc);
      this.hydrationSound = sound;
    } catch { /* skip */ }

    for (const src of repSources) {
      try {
        const { sound } = await Audio.Sound.createAsync(src);
        this.motivationalPool.repPhase.push(sound);
      } catch { /* skip failed loads */ }
    }
    for (const src of breakSources) {
      try {
        const { sound } = await Audio.Sound.createAsync(src);
        this.motivationalPool.breakPhase.push(sound);
      } catch { /* skip failed loads */ }
    }
  }
}

export default WorkoutAudioManager;
