import PatternCanvas from './components/PatternCanvas/PatternCanvas';
import rawPattern from './mockData/sample-pattern.json';
import { Pattern } from './types/pattern';

const samplePattern: Pattern = {
  ...rawPattern,
  meta: {
    ...rawPattern.meta,
    gridSize: rawPattern.meta.gridSize as [number, number],
  },
};

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <PatternCanvas pattern={samplePattern} />
    </div>
  );
}

export default App;
