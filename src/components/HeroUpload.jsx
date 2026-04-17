import React, { useState, useRef } from 'react';
import { UploadCloud, File, Loader2, ShieldCheck, Zap } from 'lucide-react';

export default function HeroUpload({ onUploadComplete, setDocumentContext }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocumentContext(event.target.result);
        simulateUpload();
      };
      reader.readAsText(file);
    } else {
      // For MVP just store the name if not text
      setDocumentContext(`File Name: ${file.name}\n(Binary file not parsed in MVP)`);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 3;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onUploadComplete();
        }, 600);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 relative p-8">
      {/* Decorative soft glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] opacity-70 pointer-events-none"></div>
      
      <div className="z-10 text-center max-w-3xl mb-12">
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
          MERai
        </h1>
        <p className="text-2xl text-blue-600 font-light mb-2">Turning Chaos into Clarity.</p>
        <p className="text-slate-500 max-w-xl mx-auto mt-6 leading-relaxed">
          Upload unstructured EPC project files—meeting minutes, transcripts, and reports—and let our intelligence engine structure your closeout data in seconds.
        </p>
      </div>

      <div className="z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative overflow-hidden">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
          accept=".txt" 
        />
        {!isUploading ? (
          <div 
            className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group"
            onClick={() => fileInputRef.current.click()}
          >
            <div className="bg-blue-50 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload project files</h3>
            <p className="text-sm text-slate-500 mb-4">Drag and drop or click to browse</p>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-md">Supports PDF, DOCX, TXT</span>
          </div>
        ) : (
          <div className="py-10 px-4 flex flex-col items-center">
            <h3 className="text-xl font-medium text-slate-800 mb-6 flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              Processing Intelligence...
            </h3>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-75 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {progress < 30 && "Parsing documents..."}
              {progress >= 30 && progress < 60 && "Extracting technical decisions..."}
              {progress >= 60 && progress < 90 && "Evaluating handover readiness..."}
              {progress >= 90 && "Finalizing closeout model..."}
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 flex gap-8 text-slate-500 text-sm z-10 font-medium">
        <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-slate-400"/> Enterprise Grade Security</span>
        <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-slate-400"/> Instant Processing</span>
      </div>
    </div>
  );
}
