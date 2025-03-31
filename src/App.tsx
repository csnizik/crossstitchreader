import PatternCanvas from './components/PatternCanvas/PatternCanvas';
import rawPattern from './mockData/sample-pattern.json';
import { Pattern } from './types/pattern';
import SymbolKey from './components/SymbolKey/SymbolKey';
import Toolbar from './components/Toolbar/Toolbar';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';

const samplePattern: Pattern = {
  ...rawPattern,
  meta: {
    ...rawPattern.meta,
    gridSize: rawPattern.meta.gridSize as [number, number],
  },
};

function App() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Toolbar />
      <SettingsPanel />
      <SymbolKey />
      <PatternCanvas pattern={samplePattern} />
    </div>
  );
}

export default App;
