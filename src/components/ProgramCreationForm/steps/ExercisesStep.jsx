'use client';

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaGripLines, FaPlus } from 'react-icons/fa';
import styles from '../ProgramCreationForm.module.css';

export default function ExercisesStep({ workoutGroups, updateFormData }) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  // New exercise form state
  const [newExercise, setNewExercise] = useState({
    id: '',
    name: '',
    targetWarmupSets: '',
    targetWorkingSets: '',
    targetReps: '',
    notes: '',
  });

  const selectedGroup = workoutGroups[selectedGroupIndex];
  const selectedDay = selectedGroup.days[selectedDayIndex] || null;

  // Reset day selection when group changes
  const handleGroupChange = (index) => {
    setSelectedGroupIndex(index);
    setSelectedDayIndex(0);
  };

  const handleAddExercise = () => {
    // Don't add exercise if it's a rest day
    if (selectedDay && selectedDay.isRestDay) {
      return;
    }

    setNewExercise({
      id: `temp-exercise-${Date.now()}`,
      name: '',
      targetWarmupSets: '',
      targetWorkingSets: '',
      targetReps: '',
      notes: '',
    });

    setShowExerciseForm(true);
  };

  const handleSaveNewExercise = () => {
    if (!newExercise.name) {
      alert('Exercise name is required');
      return;
    }

    const updatedGroups = [...workoutGroups];

    // Ensure exercises array exists
    if (!updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises) {
      updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises = [];
    }

    // Add new exercise
    updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises.push({
      ...newExercise,
      targetWarmupSets: parseInt(newExercise.targetWarmupSets) || 0,
      targetWorkingSets: parseInt(newExercise.targetWorkingSets) || 0,
      order:
        updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises
          .length + 1,
    });

    updateFormData(updatedGroups);
    setShowExerciseForm(false);
    setNewExercise({
      id: '',
      name: '',
      targetWarmupSets: '',
      targetWorkingSets: '',
      targetReps: '',
      notes: '',
    });
  };

  const handleCancelNewExercise = () => {
    setShowExerciseForm(false);
    setNewExercise({
      id: '',
      name: '',
      targetWarmupSets: '',
      targetWorkingSets: '',
      targetReps: '',
      notes: '',
    });
  };

  const handleDeleteExercise = (exerciseId) => {
    const updatedGroups = [...workoutGroups];
    updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises =
      updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises
        .filter((exercise) => exercise.id !== exerciseId)
        .map((exercise, index) => ({
          ...exercise,
          order: index + 1,
        }));

    updateFormData(updatedGroups);
  };

  const handleEditExercise = (exercise) => {
    setEditingExerciseId(exercise.id);
    setNewExercise({
      id: exercise.id || '',
      name: exercise.name || '',
      targetWarmupSets: exercise.targetWarmupSets?.toString() || '',
      targetWorkingSets: exercise.targetWorkingSets?.toString() || '',
      targetReps: exercise.targetReps || '',
      notes: exercise.notes || '',
    });
  };

  const handleSaveEdit = () => {
    if (!newExercise.name) {
      alert('Exercise name is required');
      return;
    }

    const updatedGroups = [...workoutGroups];
    updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises =
      updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises.map(
        (exercise) => {
          if (exercise.id === editingExerciseId) {
            return {
              ...newExercise,
              id: exercise.id,
              order: exercise.order,
            };
          }
          return exercise;
        },
      );

    updateFormData(updatedGroups);
    setEditingExerciseId(null);
    setNewExercise({
      id: '',
      name: '',
      targetWarmupSets: '',
      targetWorkingSets: '',
      targetReps: '',
      notes: '',
    });
  };

  const handleCancelEdit = () => {
    setEditingExerciseId(null);
    setNewExercise({
      id: '',
      name: '',
      targetWarmupSets: '',
      targetWorkingSets: '',
      targetReps: '',
      notes: '',
    });
  };

  const handleMoveExercise = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === selectedDay.exercises.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedGroups = [...workoutGroups];
    const exercises = [
      ...updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises,
    ];

    // Swap positions
    [exercises[index], exercises[newIndex]] = [
      exercises[newIndex],
      exercises[index],
    ];

    // Update order property
    exercises.forEach((exercise, idx) => {
      exercise.order = idx + 1;
    });

    updatedGroups[selectedGroupIndex].days[selectedDayIndex].exercises =
      exercises;
    updateFormData(updatedGroups);
  };

  const handleExerciseFormChange = (field, value) => {
    setNewExercise({
      ...newExercise,
      [field]: value,
    });
  };

  const renderExerciseForm = () => {
    return (
      <div className={styles.exerciseForm}>
        <h4>{editingExerciseId ? 'Edit Exercise' : 'Add New Exercise'}</h4>

        <div className={styles.formGroup}>
          <label htmlFor="exerciseName" className={styles.label}>
            Exercise Name*
          </label>
          <input
            id="exerciseName"
            type="text"
            className={styles.input}
            value={newExercise.name}
            onChange={(e) => handleExerciseFormChange('name', e.target.value)}
            placeholder="e.g., Bench Press"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label htmlFor="exerciseWarmupSets" className={styles.label}>
              Warmup Sets
            </label>
            <input
              id="exerciseWarmupSets"
              type="number"
              min="0"
              className={styles.input}
              value={newExercise.targetWarmupSets}
              onChange={(e) =>
                handleExerciseFormChange('targetWarmupSets', e.target.value)
              }
              placeholder="e.g., 2"
            />
          </div>

          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label htmlFor="exerciseWorkingSets" className={styles.label}>
              Working Sets
            </label>
            <input
              id="exerciseWorkingSets"
              type="number"
              min="0"
              className={styles.input}
              value={newExercise.targetWorkingSets}
              onChange={(e) =>
                handleExerciseFormChange('targetWorkingSets', e.target.value)
              }
              placeholder="e.g., 3"
            />
          </div>

          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label htmlFor="exerciseReps" className={styles.label}>
              Reps
            </label>
            <input
              id="exerciseReps"
              type="text"
              className={styles.input}
              value={newExercise.targetReps}
              onChange={(e) =>
                handleExerciseFormChange('targetReps', e.target.value)
              }
              placeholder="e.g., 10 or 8-12"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="exerciseNotes" className={styles.label}>
            Notes
          </label>
          <textarea
            id="exerciseNotes"
            className={styles.textarea}
            value={newExercise.notes}
            onChange={(e) => handleExerciseFormChange('notes', e.target.value)}
            placeholder="Any additional instructions or notes..."
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={
              editingExerciseId ? handleCancelEdit : handleCancelNewExercise
            }
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={editingExerciseId ? handleSaveEdit : handleSaveNewExercise}
          >
            {editingExerciseId ? 'Save Changes' : 'Add Exercise'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>Exercises</h2>
      <p>
        Add exercises to each workout day. You can specify sets, reps, weight,
        and notes for each exercise.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="groupSelect" className={styles.label}>
          Select Workout Group
        </label>
        <select
          id="groupSelect"
          className={styles.select}
          value={selectedGroupIndex}
          onChange={(e) => handleGroupChange(Number(e.target.value))}
        >
          {workoutGroups.map((group, index) => (
            <option key={group.id} value={index}>
              {group.title || `Week ${group.order}`}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup.days.length === 0 ? (
        <p>No workout days added yet. Please go back and add days first.</p>
      ) : (
        <div className={styles.formGroup}>
          <label htmlFor="daySelect" className={styles.label}>
            Select Workout Day
          </label>
          <select
            id="daySelect"
            className={styles.select}
            value={selectedDayIndex}
            onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
          >
            {selectedGroup.days.map((day, index) => (
              <option key={day.id} value={index}>
                {day.title || (day.isRestDay ? 'Rest Day' : `Day ${day.order}`)}
                {day.isRestDay ? ' (Rest)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDay && (
        <>
          <h3>
            Exercises for{' '}
            {selectedDay.title ||
              (selectedDay.isRestDay ? 'Rest Day' : `Day ${selectedDay.order}`)}
          </h3>

          {selectedDay.isRestDay ? (
            <p>This is a rest day. No exercises needed.</p>
          ) : (
            <>
              <div>
                {!selectedDay.exercises ||
                selectedDay.exercises.length === 0 ? (
                  <p>No exercises added yet. Add your first exercise below.</p>
                ) : (
                  selectedDay.exercises.map((exercise, index) => (
                    <div key={exercise.id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>
                          <span className={styles.dragHandle}>
                            <FaGripLines />
                          </span>
                          {exercise.name}
                        </h3>

                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => handleMoveExercise(index, 'up')}
                            disabled={index === 0}
                            title="Move Up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => handleMoveExercise(index, 'down')}
                            disabled={
                              index === selectedDay.exercises.length - 1
                            }
                            title="Move Down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => handleEditExercise(exercise)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => handleDeleteExercise(exercise.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <div>
                          {exercise.targetWarmupSets > 0 &&
                            `${exercise.targetWarmupSets} ${exercise.targetWarmupSets === 1 ? 'warmup set' : 'warmup sets'}`}
                          {exercise.targetWarmupSets > 0 &&
                            exercise.targetWorkingSets > 0 &&
                            ' + '}
                          {exercise.targetWorkingSets > 0 &&
                            `${exercise.targetWorkingSets} ${exercise.targetWorkingSets === 1 ? 'working set' : 'working sets'}`}
                          {(exercise.targetWarmupSets > 0 ||
                            exercise.targetWorkingSets > 0) &&
                            exercise.targetReps &&
                            ' × '}
                          {exercise.targetReps && `${exercise.targetReps} reps`}
                        </div>
                        {exercise.notes && (
                          <div
                            style={{
                              marginTop: '0.25rem',
                              fontStyle: 'italic',
                            }}
                          >
                            {exercise.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {editingExerciseId || showExerciseForm ? (
                renderExerciseForm()
              ) : (
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={handleAddExercise}
                >
                  <FaPlus /> Add Exercise
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
