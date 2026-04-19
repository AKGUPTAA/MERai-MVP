import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, ShieldCheck, Zap, FileText, X, AlertCircle } from 'lucide-react';
import { analyzeReadiness, analyzeDecisions } from '../services/openai';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import mammoth from 'mammoth';

// Use CDN worker for pdf.js so Vite doesn't need to bundle it
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'txt' || file.type === 'text/plain') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  if (ext === 'pdf' || file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
  }

  if (ext === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  return `[File: ${file.name} — format not supported for text extraction in this version]`;
}

export default function HeroUpload({ apiKey, onUploadComplete, setDocumentContext, setFileNames, setReadinessData, setDecisionsData, onOpenSettings }) {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const newFiles = [...files];
    for (const file of selectedFiles) {
      try {
        const content = await extractTextFromFile(file);
        newFiles.push({ name: file.name, content });
      } catch (err) {
        newFiles.push({ name: file.name, content: `[Error reading ${file.name}: ${err.message}]` });
      }
    }
    setFiles([...newFiles]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (!apiKey) { onOpenSettings(); return; }
    if (files.length === 0) return;

    setIsProcessing(true);
    setError('');

    const combinedContext = files.map(f => `--- FILE: ${f.name} ---\n${f.content}`).join('\n\n');
    setDocumentContext(combinedContext);
    setFileNames(files.map(f => f.name));

    try {
      setProgress(15);
      setStatusText('Parsing documents...');
      await new Promise(r => setTimeout(r, 300));

      setProgress(35);
      setStatusText('Analyzing handover readiness...');
      const readiness = await analyzeReadiness(apiKey, combinedContext);
      setReadinessData(readiness);

      setProgress(70);
      setStatusText('Extracting decisions and approval chains...');
      const decisions = await analyzeDecisions(apiKey, combinedContext);
      setDecisionsData(decisions);

      setProgress(100);
      setStatusText('Analysis complete.');
      await new Promise(r => setTimeout(r, 500));
      onUploadComplete();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to process. Check your API key and try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    const colors = { pdf: 'text-red-500', docx: 'text-blue-500', txt: 'text-slate-400' };
    return colors[ext] || 'text-slate-400';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 relative p-8">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] opacity-70 pointer-events-none"></div>

      <div className="z-10 text-center max-w-3xl mb-12">
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight mb-4">MERai</h1>
        <p className="text-2xl text-blue-600 font-light mb-2">Turning Chaos into Clarity.</p>
        <p className="text-slate-500 max-w-xl mx-auto mt-6 leading-relaxed">
          Upload project files — meeting transcripts, minutes, reports, emails — and let our AI engine analyze handover readiness, extract decisions, and build your project memory.
        </p>
      </div>

      <div className="z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".txt,.pdf,.docx"
          multiple
        />

        {!isProcessing ? (
          <>
            <div
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="bg-blue-50 p-5 rounded-full mb-5 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Click to add files</h3>
              <p className="text-sm text-slate-500 mb-3">Select one or multiple files</p>
              <div className="flex gap-2">
                {['PDF', 'DOCX', 'TXT'].map(f => (
                  <span key={f} className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-md">{f}</span>
                ))}
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{files.length} file{files.length > 1 ? 's' : ''} ready</p>
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 ${getFileIcon(file.name)}`} />
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[300px]">{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleProcess}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors shadow-sm shadow-blue-600/20"
                >
                  {apiKey ? 'Analyze with MERai' : 'Set API Key & Analyze'}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </>
        ) : (
          <div className="py-10 px-4 flex flex-col items-center">
            <h3 className="text-xl font-medium text-slate-800 mb-6 flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              Processing Intelligence...
            </h3>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
              <div className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <p className="text-sm text-slate-500 font-medium">{statusText}</p>
          </div>
        )}
      </div>

      <div className="mt-16 flex gap-8 text-slate-500 text-sm z-10 font-medium">
        <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-slate-400" /> Enterprise Grade Security</span>
        <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-slate-400" /> Powered by Gemini</span>
      </div>
    </div>
  );
}
