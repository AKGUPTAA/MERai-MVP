import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HeroUpload from './components/HeroUpload';
import ReadinessDashboard from './components/ReadinessDashboard';
import DecisionIntelligence from './components/DecisionIntelligence';
import ProjectMemory from './components/ProjectMemory';
import SettingsModal from './components/SettingsModal';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploaded, setIsUploaded] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [documentContext, setDocumentContext] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(!localStorage.getItem('openai_api_key'));

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isUploaded={isUploaded} onOpenSettings={() => setIsSettingsOpen(true)} />
      <main className="flex-1 overflow-y-auto w-full relative">
        {activeTab === 'upload' && <HeroUpload setDocumentContext={setDocumentContext} onUploadComplete={() => { setIsUploaded(true); setActiveTab('readiness'); }} />}
        {activeTab === 'readiness' && <ReadinessDashboard />}
        {activeTab === 'decisions' && <DecisionIntelligence />}
        {activeTab === 'memory' && <ProjectMemory apiKey={apiKey} documentContext={documentContext} />}
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          apiKey={apiKey} 
          setApiKey={(key) => {
            setApiKey(key);
            localStorage.setItem('openai_api_key', key);
            setIsSettingsOpen(false);
          }} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
