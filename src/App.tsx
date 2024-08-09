import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState<number>(() => {
    // Load click nambers
    const savedCount = localStorage.getItem('clickCount');
    return savedCount !== null ? parseInt(savedCount) : 0;
  });

  // Save click Numbers
  useEffect(() => {
    localStorage.setItem('clickCount', count.toString());
  }, [count]);

  return (
    <>
      <h1>Clicker</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
