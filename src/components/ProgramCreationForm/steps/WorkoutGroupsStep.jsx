'use client';

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaGripLines, FaPlus } from 'react-icons/fa';
import styles from '../ProgramCreationForm.module.css';

export default function WorkoutGroupsStep({ workoutGroups, updateFormData }) {
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroupTitle, setNewGroupTitle] = useState('');

  const handleAddGroup = () => {
    const newOrder = workoutGroups.length + 1;
    const newGroup = {
      id: `temp-group-${Date.now()}`,
      title: `Week ${newOrder}`,
      order: newOrder,
      days: [],
    };

    updateFormData([...workoutGroups, newGroup]);
  };

  const handleDeleteGroup = (groupId) => {
    const updatedGroups = workoutGroups
      .filter((group) => group.id !== groupId)
      .map((group, index) => ({
        ...group,
        order: index + 1,
      }));

    updateFormData(updatedGroups);
  };

  const handleEditGroup = (group) => {
    setEditingGroupId(group.id);
    setNewGroupTitle(group.title);
  };

  const handleSaveEdit = (groupId) => {
    const updatedGroups = workoutGroups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          title: newGroupTitle || `Week ${group.order}`,
        };
      }
      return group;
    });

    updateFormData(updatedGroups);
    setEditingGroupId(null);
    setNewGroupTitle('');
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setNewGroupTitle('');
  };

  const handleMoveGroup = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === workoutGroups.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedGroups = [...workoutGroups];

    // Swap positions
    [updatedGroups[index], updatedGroups[newIndex]] = [
      updatedGroups[newIndex],
      updatedGroups[index],
    ];

    // Update order property
    updatedGroups.forEach((group, idx) => {
      group.order = idx + 1;
    });

    updateFormData(updatedGroups);
  };

  return (
    <div>
      <h2>Workout Groups</h2>
      <p>
        Create groups for your workout program (e.g., weeks or phases). Each
        group can contain multiple workout days.
      </p>

      <div>
        {workoutGroups.map((group, index) => (
          <div key={group.id} className={styles.card}>
            <div className={styles.cardHeader}>
              {editingGroupId === group.id ? (
                <input
                  type="text"
                  className={styles.input}
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder={`Week ${group.order}`}
                  autoFocus
                />
              ) : (
                <h3 className={styles.cardTitle}>
                  <span className={styles.dragHandle}>
                    <FaGripLines />
                  </span>
                  {group.title || `Week ${group.order}`}
                </h3>
              )}

              <div className={styles.cardActions}>
                {editingGroupId === group.id ? (
                  <>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => handleSaveEdit(group.id)}
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
                      onClick={() => handleMoveGroup(index, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => handleMoveGroup(index, 'down')}
                      disabled={index === workoutGroups.length - 1}
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => handleEditGroup(group)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => handleDeleteGroup(group.id)}
                      disabled={workoutGroups.length <= 1}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddGroup}
      >
        <FaPlus /> Add Workout Group
      </button>
    </div>
  );
}
