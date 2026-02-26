import { useEffect, useRef } from 'react';
import WorkoutAudioManager from '../services/workout-audio-manager';

// Custom hook encapsulating all workout voice audio logic:
// - Rep counting voice (plays number at start of each rep)
// - Progressive motivational phrases between reps
// - Break phase motivational on interval
// - Pause/resume and cleanup handling
const useWorkoutAudio = ({
  playSounds,
  reps,
  timeBetweenRepsInSec,
  completedRepsInSet,
  currentSet,
  isInBreak,
  isPaused,
  isComplete,
  elapsed,
}) => {
  const audioManagerRef = useRef(null);
  const prevRepRef = useRef(0);
  const prevSetRef = useRef(1);
  const motivationalTimerRef = useRef(null);
  // Ref to avoid stale closure in setTimeout/setInterval callbacks
  const isPausedRef = useRef(isPaused);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Initialize audio manager and preload sounds
  // eslint-disable-next-line react-hooks/exhaustive-deps -- route params are stable
  useEffect(() => {
    if (!playSounds) return;
    const mgr = new WorkoutAudioManager();
    audioManagerRef.current = mgr;
    mgr.init().then(() => mgr.preload(reps));
    return () => {
      if (motivationalTimerRef.current) clearTimeout(motivationalTimerRef.current);
      mgr.cleanup();
    };
  }, []);

  // Voice rep counting — play number when rep increments
  useEffect(() => {
    if (!playSounds || !audioManagerRef.current || isPaused || isComplete) return;
    const mgr = audioManagerRef.current;

    // Detect set change → reset rep tracking
    if (currentSet !== prevSetRef.current) {
      prevRepRef.current = 0;
      prevSetRef.current = currentSet;
    }

    // Detect rep increment during rep phase
    if (completedRepsInSet > prevRepRef.current && !isInBreak) {
      mgr.playRepSound(completedRepsInSet);

      // Maybe schedule motivational between this rep and next (only if enough time gap)
      if (motivationalTimerRef.current) clearTimeout(motivationalTimerRef.current);
      if (mgr.shouldPlayMotivational(completedRepsInSet, reps, timeBetweenRepsInSec)) {
        // Schedule at 60% of the gap so motivational has time to finish before next rep
        const delay = Math.floor(timeBetweenRepsInSec * 0.6) * 1000;
        motivationalTimerRef.current = setTimeout(() => {
          if (!isPausedRef.current) mgr.playMotivational('rep-phase');
        }, delay);
      }

      prevRepRef.current = completedRepsInSet;
    }
  }, [elapsed]);

  // Break phase — hydration first, then motivational on interval
  useEffect(() => {
    if (!playSounds || !audioManagerRef.current || !isInBreak || isPaused) return;
    const mgr = audioManagerRef.current;
    // Always play hydration reminder first when entering break
    mgr.playHydration();
    // Then other break motivational every ~8s
    const interval = setInterval(() => {
      if (!isPausedRef.current) mgr.playMotivational('break-phase');
    }, 8000);
    return () => clearInterval(interval);
  }, [isInBreak, isPaused]);

  // Pause → stop current audio
  useEffect(() => {
    if (isPaused && audioManagerRef.current) {
      audioManagerRef.current.stopCurrent();
    }
  }, [isPaused]);
};

export default useWorkoutAudio;
