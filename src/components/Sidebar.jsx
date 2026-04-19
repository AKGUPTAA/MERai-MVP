import React from 'react';
import { UploadCloud, CheckCircle, BrainCircuit, MessageSquareText, FileText, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ activeTab, setActiveTab, isUploaded, fileNames, onOpenSettings }) {
  const navItems = [
    { id: 'upload', label: 'Upload Data', icon: UploadCloud, always: true },
    { id: 'readiness', label: 'Handover Readiness', icon: CheckCircle, always: false },
    { id: 'decisions', label: 'Decision Intelligence', icon: BrainCircuit, always: false },
    { id: 'memory', label: 'Project Memory', icon: MessageSquareText, always: false },
  ];

  return (
    <aside className="w-64 bg-slate-950 flex flex-col items-center py-8 text-white border-r border-slate-800 shadow-xl z-10 transition-all duration-300">
      <div className="flex items-center gap-2 mb-10 px-6 w-full">
        <div className="bg-blue-600 p-2 rounded-lg">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight">MERai</span>
          <span className="text-[10px] text-blue-300 tracking-wider uppercase font-semibold">Project Intelligence</span>
        </div>
      </div>

      <nav className="flex-1 w-full flex flex-col gap-2 px-4">
        {navItems.map((item) => {
          if (!item.always && !isUploaded) return null;
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm w-full text-left",
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <Icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {isUploaded && fileNames && fileNames.length > 0 && (
        <div className="px-6 w-full mb-6">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-3">Indexed Files</p>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {fileNames.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 truncate">{name}</span>
                </div>
              ))}
            </div>
            <p className="text-blue-400 text-[11px] mt-3 font-medium">{fileNames.length} file{fileNames.length > 1 ? 's' : ''} analyzed</p>
          </div>
        </div>
      )}

      <div className="w-full px-4 mb-4">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 transition-colors w-full rounded-xl hover:bg-slate-800 text-sm font-medium"
        >
          <Settings className="w-4 h-4" />
          API Settings
        </button>
      </div>
    </aside>
  );
}
