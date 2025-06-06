"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthorizationTestPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return (
      <div>
        <h1>Authorization Test</h1>
        <p>Welcome, {session.user?.name || session.user?.email}! You are logged in.</p>
        <button onClick={() => signOut({ callbackUrl: "/" })}>Log Out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Authorization Test</h1>
      <p>You are not logged in. Please log in to access more features.</p>
      <button onClick={() => signIn()}>Log In</button>
    </div>
  );
}
