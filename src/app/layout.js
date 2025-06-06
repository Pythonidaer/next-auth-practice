import "./globals.css";
import AuthProvider from './context/AuthProvider'

import Navbar from "../components/Navbar";

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: "Hello Next Auth",
  description: "Blank Next.js Auth Starter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />{children}
        </AuthProvider>
      </body>
    </html>
  );
}
