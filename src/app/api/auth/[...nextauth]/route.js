import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
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
  },
});

export { handler as GET, handler as POST };
