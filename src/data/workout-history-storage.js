// AsyncStorage helper for tracking completed workouts per muscle group
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@completed_workouts';

// Save a completed workout
export async function saveCompletedWorkout(exerciseName, muscle) {
  try {
    const existing = await getCompletedWorkouts();
    // Avoid duplicates (same exercise name + muscle)
    const alreadyExists = existing.some(
      (w) => w.exerciseName === exerciseName && w.muscle === muscle
    );
    if (alreadyExists) return;

    existing.push({
      exerciseName,
      muscle: muscle || 'general',
      timestamp: Date.now(),
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to save workout:', e);
  }
}

// Get all completed workouts
export async function getCompletedWorkouts() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.warn('Failed to read workouts:', e);
    return [];
  }
}

// Get completed count per muscle group
export async function getProgressByMuscle() {
  const workouts = await getCompletedWorkouts();
  const counts = {};
  workouts.forEach(({ muscle }) => {
    if (!muscle || muscle === 'general') return;
    counts[muscle] = (counts[muscle] || 0) + 1;
  });
  return counts;
}
