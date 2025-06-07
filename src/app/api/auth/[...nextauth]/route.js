import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

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
    async redirect({ url, baseUrl }) {
      // Always redirect to homepage after sign-in
      return baseUrl
    }
  }
})

export { handler as GET, handler as POST }
