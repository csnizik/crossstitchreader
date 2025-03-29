import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useStore } from './store';

function App() {
  const [count, setCount] = useState(0);

 useEffect(() => {
   // Set test values in the Zustand store
   useStore.setState({
     pattern: 'test pattern',
     stitches: ['stitch1', 'stitch2'],
     displayMode: 'test mode',
     placeholder: 'test placeholder',
   });
 }, []);

   const pattern = useStore((state) => state.pattern);
   const stitches = useStore((state) => state.stitches);
   const displayMode = useStore((state) => state.displayMode);
   const placeholder = useStore((state) => state.placeholder);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div>
        <h2>Zustand Store Values:</h2>
        <p>Pattern: {pattern}</p>
        <p>Stitches: {stitches.join(', ')}</p>
        <p>Display Mode: {displayMode}</p>
        <p>Placeholder: {placeholder}</p>
      </div>{' '}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
