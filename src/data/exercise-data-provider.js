// Data provider using data/exercises.json (exercisedb format with gifUrl)
import allExercises from '../../data/exercises.json';

// Category filter chips based on bodyParts from the dataset
export const CATEGORY_FILTERS = [
  { label: 'All', type: 'all' },
  { label: 'Chest', type: 'bodyPart', value: 'chest' },
  { label: 'Back', type: 'bodyPart', value: 'back' },
  { label: 'Shoulders', type: 'bodyPart', value: 'shoulders' },
  { label: 'Upper Arms', type: 'bodyPart', value: 'upper arms' },
  { label: 'Upper Legs', type: 'bodyPart', value: 'upper legs' },
  { label: 'Waist', type: 'bodyPart', value: 'waist' },
  { label: 'Cardio', type: 'bodyPart', value: 'cardio' },
  { label: 'Lower Arms', type: 'bodyPart', value: 'lower arms' },
  { label: 'Lower Legs', type: 'bodyPart', value: 'lower legs' },
];

// Display names for targetMuscles → workout card titles
const MUSCLE_DISPLAY_NAMES = {
  abs: 'Abs Workout',
  abductors: 'Abductors Workout',
  adductors: 'Adductors Workout',
  biceps: 'Biceps Workout',
  calves: 'Calves Workout',
  'cardiovascular system': 'Cardio Workout',
  delts: 'Delts Workout',
  forearms: 'Forearms Workout',
  glutes: 'Glutes Workout',
  hamstrings: 'Hamstrings Workout',
  lats: 'Lats Workout',
  'levator scapulae': 'Levator Scapulae',
  pectorals: 'Chest Workout',
  quads: 'Quads Workout',
  'serratus anterior': 'Serratus Anterior',
  spine: 'Spine Workout',
  traps: 'Traps Workout',
  triceps: 'Triceps Workout',
  'upper back': 'Upper Back Workout',
};

// Filter exercises based on selected category chip
export function getFilteredExercises(selectedLabel) {
  const filter = CATEGORY_FILTERS.find((f) => f.label === selectedLabel);
  if (!filter || filter.type === 'all') return allExercises;

  return allExercises.filter((ex) =>
    ex.bodyParts.includes(filter.value)
  );
}

// Get exercises for a specific target muscle (for detail screen)
export function getExercisesByMuscle(muscle) {
  return allExercises.filter((ex) => ex.targetMuscles.includes(muscle));
}

// Get display name for a muscle group
export function getMuscleDisplayName(muscle) {
  return (
    MUSCLE_DISPLAY_NAMES[muscle] ||
    `${muscle.charAt(0).toUpperCase() + muscle.slice(1)} Workout`
  );
}

// Group exercises by targetMuscles → workout cards
export function getWorkoutGroups(exercises) {
  const groups = {};

  exercises.forEach((ex) => {
    ex.targetMuscles.forEach((muscle) => {
      if (!groups[muscle]) groups[muscle] = [];
      groups[muscle].push(ex);
    });
  });

  return Object.entries(groups)
    .map(([muscle, exList]) => ({
      id: muscle,
      name:
        MUSCLE_DISPLAY_NAMES[muscle] ||
        `${muscle.charAt(0).toUpperCase() + muscle.slice(1)} Workout`,
      exerciseCount: exList.length,
      duration: `${Math.round(exList.length * 1.2)} Min`,
      // Use first exercise's gif as thumbnail for the group
      gifUrl: exList[0]?.gifUrl || null,
    }))
    .sort((a, b) => b.exerciseCount - a.exerciseCount);
}
