import PatternCanvas from './components/PatternCanvas/PatternCanvas';
import rawPattern from './mockData/sample-pattern.json';
import { Pattern } from './types/pattern';
import SymbolKey from './components/SymbolKey/SymbolKey';
import Toolbar from './components/Toolbar/Toolbar';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import {Toaster} from 'sonner';

const samplePattern: Pattern = {
  ...rawPattern,
  meta: {
    ...rawPattern.meta,
    gridSize: rawPattern.meta.gridSize as [number, number],
  },
};

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">

      <Toolbar />

      <div className="absolute inset-0 z-0">
        <PatternCanvas pattern={samplePattern} />
      </div>

      <SymbolKey />
      <SettingsPanel />
      <Toaster richColors position="top-right" />
    </div>
  );
}


export default App;
