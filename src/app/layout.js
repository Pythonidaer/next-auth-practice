import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { League_Spartan } from 'next/font/google';
import AuthProvider from './context/AuthProvider';
import Navbar from '../components/Navbar/Navbar';
import ClientLayout from '../components/ClientLayout';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
});

export const metadata = {
  title: 'Meatbag',
  description: 'Workout Application',
  icons: {
    icon: '/favicon.ico',
  },
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
