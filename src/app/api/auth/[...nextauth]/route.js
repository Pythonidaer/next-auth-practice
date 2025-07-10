import NextAuth from 'next-auth';
// import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../../../../utils/prisma.js'; // adjust path if needed

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin', // optional
  },
  callbacks: {
    // can also pass url as a param
    async redirect({ baseUrl }) {
      // Only allow redirects within your site
      // return url.startsWith(baseUrl) ? url : baseUrl;

      // Always redirect to homepage after sign-in
      return baseUrl;
    },
    // lets you customize the session object returned to the client.
    async session({ session, user }) {
      session.userId = user.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

/*
Future to look into:
✅ When to Use It:
Use this if your app logic depends on
 identifying the currently logged-in user by their database id, e.g.:

const session = await getServerSession(authOptions);
const userId = session?.userId;
const workouts = await prisma.workoutProgram.findMany({ where: { userId } });
*/
