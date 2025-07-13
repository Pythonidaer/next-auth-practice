// prisma/seed.mjs
import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  // Use existing user ID
  const userId = 'fda27cfe-4897-4d34-8945-12e2c29859b2';

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    console.error(
      `User with ID ${userId} not found. Please check the ID and try again.`,
    );
    return;
  }

  console.log(`Found user: ${existingUser.name || existingUser.email}`);

  // Create a workout program
  const strengthProgram = await prisma.workoutProgram.create({
    data: {
      title: 'Strength Building Program',
      description:
        'A 4-week program focused on building overall strength with progressive overload.',
      createdByUserId: userId,
    },
  });

  console.log(`Created workout program: ${strengthProgram.title}`);

  // Create workout groups (weeks)
  const workoutGroups = [];
  for (let i = 1; i <= 4; i++) {
    const workoutGroup = await prisma.workoutGroup.create({
      data: {
        programId: strengthProgram.id,
        order: i,
        title: `Week ${i}`,
      },
    });
    workoutGroups.push(workoutGroup);
    console.log(`Created workout group: ${workoutGroup.title}`);
  }

  // Exercise templates for different types of workouts
  const exerciseTemplates = {
    upperBody: [
      {
        name: 'Bench Press',
        targetWarmupSets: 2,
        targetWorkingSets: 3,
        targetReps: '5-8 reps',
      },
      {
        name: 'Overhead Press',
        targetWarmupSets: 2,
        targetWorkingSets: 3,
        targetReps: '6-10 reps',
      },
      {
        name: 'Pull-Ups',
        targetWarmupSets: 1,
        targetWorkingSets: 3,
        targetReps: '8-12 reps',
      },
      {
        name: 'Barbell Rows',
        targetWarmupSets: 2,
        targetWorkingSets: 3,
        targetReps: '8-10 reps',
      },
      {
        name: 'Lateral Raises',
        targetWarmupSets: 1,
        targetWorkingSets: 3,
        targetReps: '12-15 reps',
      },
    ],
    lowerBody: [
      {
        name: 'Squats',
        targetWarmupSets: 3,
        targetWorkingSets: 4,
        targetReps: '5-8 reps',
      },
      {
        name: 'Romanian Deadlifts',
        targetWarmupSets: 2,
        targetWorkingSets: 3,
        targetReps: '8-10 reps',
      },
      {
        name: 'Leg Press',
        targetWarmupSets: 2,
        targetWorkingSets: 3,
        targetReps: '8-12 reps',
      },
      {
        name: 'Calf Raises',
        targetWarmupSets: 1,
        targetWorkingSets: 4,
        targetReps: '15-20 reps',
      },
      {
        name: 'Leg Extensions',
        targetWarmupSets: 1,
        targetWorkingSets: 3,
        targetReps: '10-15 reps',
      },
    ],
    fullBody: [
      {
        name: 'Deadlifts',
        targetWarmupSets: 3,
        targetWorkingSets: 3,
        targetReps: '5-6 reps',
      },
      {
        name: 'Incline Bench Press',
        targetWarmupSets: 2,
        targetWorkingSets: 3,
        targetReps: '8-10 reps',
      },
      {
        name: 'Front Squats',
        targetWarmupSets: 2,
        targetWorkingSets: 3,
        targetReps: '6-8 reps',
      },
      {
        name: 'Chin-Ups',
        targetWarmupSets: 1,
        targetWorkingSets: 3,
        targetReps: '8-12 reps',
      },
      {
        name: 'Dips',
        targetWarmupSets: 1,
        targetWorkingSets: 3,
        targetReps: '8-12 reps',
      },
    ],
    core: [
      {
        name: 'Hanging Leg Raises',
        targetWarmupSets: 1,
        targetWorkingSets: 3,
        targetReps: '10-15 reps',
      },
      {
        name: 'Cable Crunches',
        targetWarmupSets: 1,
        targetWorkingSets: 3,
        targetReps: '12-15 reps',
      },
      {
        name: 'Russian Twists',
        targetWarmupSets: 1,
        targetWorkingSets: 3,
        targetReps: '15-20 reps per side',
      },
      {
        name: 'Plank',
        targetWarmupSets: 0,
        targetWorkingSets: 3,
        targetReps: '30-60 seconds',
      },
      {
        name: 'Ab Wheel Rollouts',
        targetWarmupSets: 1,
        targetWorkingSets: 3,
        targetReps: '8-12 reps',
      },
    ],
  };

  // Create workout days and exercises for each group
  for (const group of workoutGroups) {
    // Each week has 7 days
    for (let dayOrder = 1; dayOrder <= 7; dayOrder++) {
      // Determine if it's a rest day (day 3, 6, and 7 are rest days)
      const isRestDay = [3, 6, 7].includes(dayOrder);

      const workoutDay = await prisma.workoutDay.create({
        data: {
          groupId: group.id,
          order: dayOrder,
          isRestDay,
        },
      });

      console.log(
        `Created workout day: Day ${dayOrder} (${isRestDay ? 'Rest Day' : 'Training Day'})`,
      );

      // Skip exercise creation for rest days
      if (isRestDay) continue;

      // Determine workout type based on the day
      let workoutType;
      switch (dayOrder) {
        case 1:
          workoutType = 'upperBody';
          break;
        case 2:
          workoutType = 'lowerBody';
          break;
        case 4:
          workoutType = 'fullBody';
          break;
        case 5:
          workoutType = 'core';
          break;
        default:
          workoutType = 'fullBody';
      }

      // Create exercises for this day
      const exercises = exerciseTemplates[workoutType];
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];

        // Add progressive overload for weeks 2-4
        const weekMultiplier = group.order - 1;
        const progressiveNotes =
          weekMultiplier > 0
            ? `Increase weight by ${5 * weekMultiplier}% from Week 1`
            : 'Establish baseline weights';

        await prisma.exercise.create({
          data: {
            dayId: workoutDay.id,
            name: exercise.name,
            notes: `${exercise.name} - ${progressiveNotes}`,
            targetWarmupSets: exercise.targetWarmupSets,
            targetWorkingSets: exercise.targetWorkingSets,
            targetReps: exercise.targetReps,
            order: i + 1,
          },
        });
      }

      console.log(`Created ${exercises.length} exercises for day ${dayOrder}`);
    }
  }

  // Create a second program (shorter one)
  const cardioProgram = await prisma.workoutProgram.create({
    data: {
      title: 'Cardio Conditioning',
      description: 'A 2-week program to improve cardiovascular endurance.',
      createdByUserId: userId,
    },
  });

  console.log(`Created workout program: ${cardioProgram.title}`);

  // Create workout groups for cardio program
  const cardioGroups = [];
  for (let i = 1; i <= 2; i++) {
    const workoutGroup = await prisma.workoutGroup.create({
      data: {
        programId: cardioProgram.id,
        order: i,
        title: `Week ${i}`,
      },
    });
    cardioGroups.push(workoutGroup);
  }

  // Cardio exercise templates
  const cardioExercises = [
    {
      name: 'Running',
      targetWarmupSets: 1,
      targetWorkingSets: 1,
      targetReps: '20-30 minutes',
    },
    {
      name: 'Jump Rope',
      targetWarmupSets: 1,
      targetWorkingSets: 3,
      targetReps: '5 minutes per set',
    },
    {
      name: 'Burpees',
      targetWarmupSets: 1,
      targetWorkingSets: 3,
      targetReps: '10-15 reps',
    },
    {
      name: 'Mountain Climbers',
      targetWarmupSets: 1,
      targetWorkingSets: 3,
      targetReps: '30 seconds',
    },
    {
      name: 'High Knees',
      targetWarmupSets: 1,
      targetWorkingSets: 3,
      targetReps: '30 seconds',
    },
  ];

  // Create workout days and exercises for cardio program
  for (const group of cardioGroups) {
    for (let dayOrder = 1; dayOrder <= 7; dayOrder++) {
      // Days 2, 4, and 7 are rest days for cardio program
      const isRestDay = [2, 4, 7].includes(dayOrder);

      const workoutDay = await prisma.workoutDay.create({
        data: {
          groupId: group.id,
          order: dayOrder,
          isRestDay,
        },
      });

      if (isRestDay) continue;

      // Create cardio exercises for this day
      for (let i = 0; i < cardioExercises.length; i++) {
        const exercise = cardioExercises[i];

        // Week 2 increases intensity
        const weekMultiplier = group.order - 1;
        const progressiveNotes =
          weekMultiplier > 0
            ? 'Increase intensity or duration by 20%'
            : 'Focus on proper form and consistent pace';

        await prisma.exercise.create({
          data: {
            dayId: workoutDay.id,
            name: exercise.name,
            notes: `${exercise.name} - ${progressiveNotes}`,
            targetWarmupSets: exercise.targetWarmupSets,
            targetWorkingSets: exercise.targetWorkingSets,
            targetReps: exercise.targetReps,
            order: i + 1,
          },
        });
      }
    }
  }

  // Create a sample workout assignment (assign the strength program to the same user for demo purposes)
  await prisma.workoutAssignment.create({
    data: {
      senderId: userId,
      recipientId: userId, // In a real scenario, this would be a different user
      programId: strengthProgram.id,
    },
  });

  console.log('Created a sample workout assignment');

  // Create user workout stats for the strength program
  await prisma.userWorkoutStat.create({
    data: {
      userId: userId,
      programId: strengthProgram.id,
      programStartDate: new Date(),
    },
  });

  console.log('Created user workout stats');

  // Optional: Create a few sample completion records
  // Get the first day of the first group of the strength program
  const firstGroup = workoutGroups[0];
  const firstDay = await prisma.workoutDay.findFirst({
    where: {
      groupId: firstGroup.id,
      isRestDay: false,
    },
    include: {
      exercises: true,
    },
  });

  if (firstDay && firstDay.exercises.length > 0) {
    // Mark the first exercise as completed
    const firstExercise = firstDay.exercises[0];

    await prisma.exerciseCompletion.create({
      data: {
        exerciseId: firstExercise.id,
        userId: userId,
        workoutDayId: firstDay.id,
        programId: strengthProgram.id,
        userNotes: 'Felt good, increased weight from last time.',
      },
    });

    console.log('Created a sample exercise completion');
  }

  // Set the active workout program for the user
  await prisma.user.update({
    where: { id: userId },
    data: {
      activeWorkoutProgramId: '1429a78f-7f5b-46cb-a95b-cab58666de87'
    }
  });

  console.log('Set active workout program for user');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
