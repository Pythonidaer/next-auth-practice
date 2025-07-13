import { auth } from '@/app/lib/auth';
import { prisma } from '@/utils/prisma';

export async function PUT(request) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user || !session.user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;
    const { programId } = await request.json();

    // Validate programId
    if (!programId) {
      return new Response(JSON.stringify({ error: 'Program ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the program exists
    const program = await prisma.workoutProgram.findUnique({
      where: { id: programId },
      select: { id: true },
    });

    if (!program) {
      return new Response(JSON.stringify({ error: 'Program not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the user's active program
    await prisma.user.update({
      where: { id: userId },
      data: { activeWorkoutProgramId: programId },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating active program:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
