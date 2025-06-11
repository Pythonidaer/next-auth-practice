'use client';
import Button from '../components/Button/Button';
import { FaStopwatch } from 'react-icons/fa';
import { PiSparkleFill } from 'react-icons/pi';

import { useSession } from 'next-auth/react';
import getFirstName from '../utils/getFirstName';

export default function Home() {
  const { data: session, status } = useSession();

  // Button handlers
  function handleStart() {
    alert('Start button clicked!');
  }
  function handleComplete() {
    alert('Complete button clicked!');
  }
  function handleNeutral() {
    alert('Neutral button clicked!');
  }
  function handleTimer() {
    alert('Timer button clicked!');
  }
  function handleRecord() {
    alert('Record Weights button clicked!');
  }
  function handleFinish() {
    alert('Complete button clicked!');
  }
  function handleDashboard() {
    alert('Dashboard button clicked!');
  }
  function handleDay() {
    alert('Day button clicked!');
  }

  // if (status === 'loading') {
  //   return <h1>Loading...</h1>;
  // }

  if (status === 'unauthenticated') {
    return (
      <div style={{ padding: '0 40px' }}>
        <Button color="red" label="START" onClick={handleStart} />
        <Button color="green" label="COMPLETED" onClick={handleComplete} />
        <Button color="white" label="START" onClick={handleNeutral} />
        <Button
          color="blue"
          label="START"
          icon={<FaStopwatch />}
          onClick={handleTimer}
        />
        <Button
          color="blue"
          label="START SET TIMER"
          icon={<FaStopwatch />}
          onClick={handleTimer}
        />
        <Button
          color="blue"
          label="RECORD WEIGHTS"
          icon={<PiSparkleFill />}
          onClick={handleRecord}
        />
        <Button color="red" label="COMPLETE" onClick={handleFinish} />
        <Button color="white" label="DASHBOARD" onClick={handleDashboard} />
        <Button color="red" label="DAY 4" onClick={handleDay} />
        <h1>Not logged in</h1>
      </div>
    );
  }
  if (status === 'authenticated') {
    return <h1>Welcome, {getFirstName(session?.user?.name)}</h1>;
  }
}
