import { dummyUserWorkoutData } from './dummyUserWorkoutData';

describe('dummyUserWorkoutData', () => {
  it('should be an array with at least one workout day', () => {
    expect(Array.isArray(dummyUserWorkoutData)).toBe(true);
    expect(dummyUserWorkoutData.length).toBeGreaterThan(0);
  });

  it('each day should have dayNumber, complete, and exercises', () => {
    for (const day of dummyUserWorkoutData) {
      expect(day).toHaveProperty('dayNumber');
      expect(typeof day.dayNumber).toBe('number');
      expect(day).toHaveProperty('complete');
      expect(typeof day.complete).toBe('boolean');
      expect(day).toHaveProperty('exercises');
      expect(Array.isArray(day.exercises)).toBe(true);
    }
  });

  it('each exercise should have required fields', () => {
    for (const day of dummyUserWorkoutData) {
      for (const ex of day.exercises) {
        expect(ex).toHaveProperty('name');
        expect(typeof ex.name).toBe('string');
        expect(ex).toHaveProperty('workoutSets');
        expect(typeof ex.workoutSets).toBe('number');
        expect(ex).toHaveProperty('reps');
        // reps can be a number or a string (e.g. '12-15')
        expect(typeof ex.reps === 'number' || typeof ex.reps === 'string').toBe(
          true,
        );
        expect(ex).toHaveProperty('warmupSets');
        // warmupSets can be null or number
        expect(
          typeof ex.warmupSets === 'number' || ex.warmupSets === null,
        ).toBe(true);
        // details can be null or any type
        expect(ex).toHaveProperty('details');
      }
    }
  });
});
