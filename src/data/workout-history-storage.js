// AsyncStorage helper for tracking completed workouts per muscle group
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@completed_workouts';

// Auto-save a completed workout (called when workout finishes)
export async function saveCompletedWorkout(exerciseName, muscle, totalReps, calories) {
  try {
    const existing = await getCompletedWorkouts();
    const timestamp = Date.now();
    existing.push({
      exerciseName,
      muscle: muscle || 'general',
      totalReps: totalReps || 0,
      calories: calories || 0,
      timestamp,
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return timestamp;
  } catch (e) {
    console.warn('Failed to save workout:', e);
    return null;
  }
}

// Update workout custom name by timestamp (called when user presses SAVE)
export async function updateWorkoutName(timestamp, customName) {
  try {
    const workouts = await getCompletedWorkouts();
    const index = workouts.findIndex(w => w.timestamp === timestamp);
    if (index === -1) return false;
    workouts[index].customName = customName;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    return true;
  } catch (e) {
    console.warn('Failed to update workout name:', e);
    return false;
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
