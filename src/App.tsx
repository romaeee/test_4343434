import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

function App() {
  const [count, setCount] = useState<number>(() => {
    // Load click numbers
    const savedCount = localStorage.getItem('clickCount');
    return savedCount !== null ? parseInt(savedCount) : 0;
  });

  const [userData, setUserData] = useState<UserData | null>(null);

  // Save click numbers
  useEffect(() => {
    localStorage.setItem('clickCount', count.toString());
  }, [count]);

  // Get user data from Telegram WebApp
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  return (
    <>
      <h1>{userData ? userData.first_name : 'Player'}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
