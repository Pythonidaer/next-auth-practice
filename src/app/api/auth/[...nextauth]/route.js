// Import NextAuth and the auth options from our centralized configuration
import NextAuth from 'next-auth';
import { authOptions } from '../../../lib/auth';

// Create and export the API route handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// The auth helper for server components is exported from src/utils/auth.js

/*
Future to look into:
✅ When to Use It:
Use this if your app logic depends on
 identifying the currently logged-in user by their database id, e.g.:

const session = await getServerSession(authOptions);
const userId = session?.userId;
const workouts = await prisma.workoutProgram.findMany({ where: { userId } });
*/
