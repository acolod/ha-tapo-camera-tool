import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import { EntityInput } from './components/EntityInput';
import { EntityList } from './components/EntityList';
import { OutputDisplay } from './components/OutputDisplay';

function App() {
  const { state } = useContext(AppContext);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Home Assistant Camera Package Generator
          </h1>
          <p className="text-gray-600 mt-1">
            A tool to automate the setup of Tapo cameras.
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <EntityInput />

          {state.isProcessed && <EntityList />}
          
          {state.packageYaml && <OutputDisplay title="Package File" yaml={state.packageYaml} />}
          {state.lovelaceYaml && <OutputDisplay title="Lovelace Settings Card" yaml={state.lovelaceYaml} />}
          {state.automationYaml && <OutputDisplay title="Automation" yaml={state.automationYaml} />}
        </div>
      </main>

      <footer className="bg-white mt-12 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>Built for Home Assistant</p>
        </div>
      </footer>
    </div>
  );
}

export default App;