import NextAuth from 'next-auth';
// import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = NextAuth({
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      from: 'codefolio.work@gmail.com',
      sendVerificationRequest: async ({ identifier, url }) => {
        await resend.emails.send({
          to: identifier,
          from: 'codefolio.work@gmail.com',
          subject: 'Your sign-in link',
          html: `
          <p>
            Click 
            <a href="${url}">here</a> 
            to sign in to your account.
          </p>
        `,
        });
      },
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
