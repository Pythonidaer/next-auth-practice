'use client';

import { useSession } from 'next-auth/react';

/*
 For now, assume first name is the first word in the name property
 returns empty string if no name is provided
*/
function getfirstname(fullName) {
  if (!fullName) {
    return '';
  }
  return fullName.trim().split(' ')[0];
}

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <h1>Loading...</h1>;
  }

  if (status === 'unauthenticated') {
    return <h1>Not logged in</h1>;
  }

  return <h1>Welcome, {getfirstname(session?.user?.name)}</h1>;
}
