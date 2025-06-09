'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

// Cyclomatic complexity = 1
export default function AuthorizationTestPage() {
  const { data: session, status } = useSession();

  // Cyclomatic complexity = 2
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // Cyclomatic complexity = 3
  if (status === 'authenticated') {
    return (
      <div>
        <h1>Authorization Test</h1>
        <p>
          Welcome, {session.user?.name || session.user?.email}! You are logged
          in.
        </p>
        <button onClick={() => signOut({ callbackUrl: '/' })}>Log Out</button>
      </div>
    );
  }

  // After the page loads, if you're not logged in:
  return (
    <div>
      <h1>Authorization Test</h1>
      <p>You are not logged in. Please log in to access more features.</p>
      <button onClick={() => signIn()}>Log In</button>
    </div>
  );
}
