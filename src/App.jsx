import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HeroUpload from './components/HeroUpload';
import ReadinessDashboard from './components/ReadinessDashboard';
import DecisionIntelligence from './components/DecisionIntelligence';
import ProjectMemory from './components/ProjectMemory';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isUploaded={isUploaded} />
      <main className="flex-1 overflow-y-auto w-full relative">
        {activeTab === 'upload' && <HeroUpload onUploadComplete={() => { setIsUploaded(true); setActiveTab('readiness'); }} />}
        {activeTab === 'readiness' && <ReadinessDashboard />}
        {activeTab === 'decisions' && <DecisionIntelligence />}
        {activeTab === 'memory' && <ProjectMemory />}
      </main>
    </div>
  );
}

export default App;
