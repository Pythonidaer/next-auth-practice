import "./globals.css";
import AuthProvider from './context/AuthProvider'

import Navbar from "../components/Navbar";

import { League_Spartan } from 'next/font/google';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['400', '700'],
});


export const metadata = {
  title: "Hello Next Auth",
  description: "Blank Next.js Auth Starter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/LeagueGothic-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={leagueSpartan.className}>
        <AuthProvider>
          <Navbar />{children}
        </AuthProvider>
      </body>
    </html>
  );
}
