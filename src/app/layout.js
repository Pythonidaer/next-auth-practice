import './globals.css';
import AuthProvider from './context/AuthProvider';
import Navbar from '../components/Navbar/Navbar';
import ClientLayout from '../components/ClientLayout'; // <-- new
import { League_Spartan } from 'next/font/google';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
});

export const metadata = {
  title: 'DEMO: Next Auth',
  description: 'Blank Next.js Auth Starter',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/LeagueGothic-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/LeagueGothic-Regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </head>
      <body className={leagueSpartan.className}>
        <ClientLayout>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
