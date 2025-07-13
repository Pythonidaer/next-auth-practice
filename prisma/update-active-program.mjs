// prisma/update-active-program.mjs
import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function updateActiveProgram() {
  const userId = 'fda27cfe-4897-4d34-8945-12e2c29859b2';
  const programId = '1429a78f-7f5b-46cb-a95b-cab58666de87';

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      console.error(`User with ID ${userId} not found.`);
      return;
    }

    // Check if program exists
    const existingProgram = await prisma.workoutProgram.findUnique({
      where: { id: programId },
    });

    if (!existingProgram) {
      console.error(`Program with ID ${programId} not found.`);
      return;
    }

    // Update the user's active workout program
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        activeWorkoutProgramId: programId,
      },
    });

    console.log(
      `Updated active program for user: ${existingUser.name || existingUser.email}`,
    );
    console.log(`Active program set to: ${existingProgram.title}`);
  } catch (error) {
    console.error('Error updating active program:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateActiveProgram();
