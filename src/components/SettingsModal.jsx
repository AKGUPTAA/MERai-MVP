import React, { useState } from 'react';
import { Key, X } from 'lucide-react';

export default function SettingsModal({ apiKey, setApiKey, onClose }) {
  const [inputKey, setInputKey] = useState(apiKey);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" /> API Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-1 font-medium">Gemini API Key</p>
          <p className="text-xs text-slate-400 mb-4">
            Get your free key at{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              aistudio.google.com/apikey
            </a>
            . Your key is stored locally in your browser only.
          </p>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="AIza..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-mono text-sm"
          />
        </div>
        <div className="bg-slate-50 p-6 flex justify-end gap-3 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            Cancel
          </button>
          <button
            onClick={() => setApiKey(inputKey)}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
}
