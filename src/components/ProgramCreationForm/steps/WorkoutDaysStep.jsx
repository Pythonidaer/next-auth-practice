'use client';

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaGripLines, FaPlus } from 'react-icons/fa';
import styles from '../ProgramCreationForm.module.css';

export default function WorkoutDaysStep({ workoutGroups, updateFormData }) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [editingDayId, setEditingDayId] = useState(null);
  const [newDayTitle, setNewDayTitle] = useState('');
  const [isRestDay, setIsRestDay] = useState(false);

  const selectedGroup = workoutGroups[selectedGroupIndex];

  const handleAddDay = () => {
    const newOrder = selectedGroup.days.length + 1;
    const newDay = {
      id: `temp-day-${Date.now()}`,
      title: `Day ${newOrder}`,
      order: newOrder,
      isRestDay: false,
      exercises: [],
    };

    const updatedGroups = [...workoutGroups];
    updatedGroups[selectedGroupIndex].days = [
      ...updatedGroups[selectedGroupIndex].days,
      newDay,
    ];

    updateFormData(updatedGroups);
  };

  const handleAddRestDay = () => {
    const newOrder = selectedGroup.days.length + 1;
    const newDay = {
      id: `temp-day-${Date.now()}`,
      title: `Rest Day`,
      order: newOrder,
      isRestDay: true,
      exercises: [],
    };

    const updatedGroups = [...workoutGroups];
    updatedGroups[selectedGroupIndex].days = [
      ...updatedGroups[selectedGroupIndex].days,
      newDay,
    ];

    updateFormData(updatedGroups);
  };

  const handleDeleteDay = (dayId) => {
    const updatedGroups = [...workoutGroups];
    updatedGroups[selectedGroupIndex].days = updatedGroups[
      selectedGroupIndex
    ].days
      .filter((day) => day.id !== dayId)
      .map((day, index) => ({
        ...day,
        order: index + 1,
      }));

    updateFormData(updatedGroups);
  };

  const handleEditDay = (day) => {
    setEditingDayId(day.id);
    setNewDayTitle(day.title);
    setIsRestDay(day.isRestDay);
  };

  const handleSaveEdit = (dayId) => {
    const updatedGroups = [...workoutGroups];
    updatedGroups[selectedGroupIndex].days = updatedGroups[
      selectedGroupIndex
    ].days.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          title:
            newDayTitle || (day.isRestDay ? 'Rest Day' : `Day ${day.order}`),
          isRestDay,
        };
      }
      return day;
    });

    updateFormData(updatedGroups);
    setEditingDayId(null);
    setNewDayTitle('');
    setIsRestDay(false);
  };

  const handleCancelEdit = () => {
    setEditingDayId(null);
    setNewDayTitle('');
    setIsRestDay(false);
  };

  const handleMoveDay = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === selectedGroup.days.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedGroups = [...workoutGroups];
    const days = [...updatedGroups[selectedGroupIndex].days];

    // Swap positions
    [days[index], days[newIndex]] = [days[newIndex], days[index]];

    // Update order property
    days.forEach((day, idx) => {
      day.order = idx + 1;
    });

    updatedGroups[selectedGroupIndex].days = days;
    updateFormData(updatedGroups);
  };

  return (
    <div>
      <h2>Workout Days</h2>
      <p>Add workout days to each group. You can also add rest days.</p>

      <div className={styles.formGroup}>
        <label htmlFor="groupSelect" className={styles.label}>
          Select Workout Group
        </label>
        <select
          id="groupSelect"
          className={styles.select}
          value={selectedGroupIndex}
          onChange={(e) => setSelectedGroupIndex(Number(e.target.value))}
        >
          {workoutGroups.map((group, index) => (
            <option key={group.id} value={index}>
              {group.title || `Week ${group.order}`}
            </option>
          ))}
        </select>
      </div>

      <h3>Days in {selectedGroup.title || `Week ${selectedGroup.order}`}</h3>

      <div>
        {selectedGroup.days.length === 0 ? (
          <p>No workout days added yet. Add your first day below.</p>
        ) : (
          selectedGroup.days.map((day, index) => (
            <div key={day.id} className={styles.card}>
              <div className={styles.cardHeader}>
                {editingDayId === day.id ? (
                  <div>
                    <input
                      type="text"
                      className={styles.input}
                      value={newDayTitle}
                      onChange={(e) => setNewDayTitle(e.target.value)}
                      placeholder={
                        day.isRestDay ? 'Rest Day' : `Day ${day.order}`
                      }
                      autoFocus
                    />
                    <div
                      className={styles.formGroup}
                      style={{ marginTop: '0.5rem' }}
                    >
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={isRestDay}
                          onChange={(e) => setIsRestDay(e.target.checked)}
                        />
                        Rest Day
                      </label>
                    </div>
                  </div>
                ) : (
                  <h3 className={styles.cardTitle}>
                    <span className={styles.dragHandle}>
                      <FaGripLines />
                    </span>
                    {day.title ||
                      (day.isRestDay ? 'Rest Day' : `Day ${day.order}`)}
                    {day.isRestDay && ' (Rest)'}
                  </h3>
                )}

                <div className={styles.cardActions}>
                  {editingDayId === day.id ? (
                    <>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => handleSaveEdit(day.id)}
                        title="Save"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={handleCancelEdit}
                        title="Cancel"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => handleMoveDay(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => handleMoveDay(index, 'down')}
                        disabled={index === selectedGroup.days.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => handleEditDay(day)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => handleDeleteDay(day.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddDay}
        >
          <FaPlus /> Add Workout Day
        </button>

        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddRestDay}
        >
          <FaPlus /> Add Rest Day
        </button>
      </div>
    </div>
  );
}
