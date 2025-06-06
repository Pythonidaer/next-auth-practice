import "./globals.css";

export const metadata = {
  title: "Hello Next Auth",
  description: "Blank Next.js Auth Starter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
