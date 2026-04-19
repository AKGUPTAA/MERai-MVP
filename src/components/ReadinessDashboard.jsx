import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AlertCircle, CheckCircle2, XCircle, Clock, FileWarning, ArrowRight, Loader2 } from 'lucide-react';

export default function ReadinessDashboard({ data }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500">Waiting for analysis data...</p>
        </div>
      </div>
    );
  }

  const score = data.score ?? 0;
  const status = data.status ?? 'Unknown';
  const missingFiles = data.missingDocuments ?? [];
  const actionItems = data.actions ?? [];
  const unresolvedCount = data.unresolvedItems ?? 0;
  const validatedCount = data.validatedItems ?? 0;
  const complianceGaps = data.complianceGaps ?? 0;

  const statusColor = status === 'On Track'
    ? 'bg-emerald-100 text-emerald-700'
    : status === 'At Risk'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';

  return (
    <div className="p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Handover Readiness</h1>
          <p className="text-slate-500">AI-generated assessment from uploaded documents</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className={`${statusColor} text-xs font-bold px-2 py-1 rounded uppercase tracking-wide`}>{status}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 w-full text-left">Overall Readiness</h3>
          <div className="w-40 h-40">
            <CircularProgressbar
              value={score}
              text={`${score}%`}
              styles={buildStyles({
                textColor: '#1e293b',
                pathColor: score >= 70 ? '#2563eb' : score >= 40 ? '#d97706' : '#dc2626',
                trailColor: '#f1f5f9',
                textSize: '22px',
                pathTransitionDuration: 1.5,
              })}
            />
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 col-span-2 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Summary</h3>
          <div className="grid grid-cols-3 gap-4 mb-4 flex-1 items-center">
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col gap-2">
              <FileWarning className="w-6 h-6 text-red-500" />
              <span className="text-3xl font-bold text-red-600">{missingFiles.length}</span>
              <span className="text-sm font-medium text-red-800">Missing Documents</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex flex-col gap-2">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <span className="text-3xl font-bold text-amber-600">{unresolvedCount}</span>
              <span className="text-sm font-medium text-amber-800">Unresolved Items</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span className="text-3xl font-bold text-emerald-600">{validatedCount}</span>
              <span className="text-sm font-medium text-emerald-800">Validated Items</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Documents */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Missing Documents</h3>
          </div>
          {missingFiles.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">No missing documents identified.</p>
          ) : (
            <ul className="space-y-3">
              {missingFiles.map((file, idx) => (
                <li key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg"><XCircle className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{file.name}</h4>
                      <p className="text-xs text-slate-500">Owner: {file.owner}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded">{file.impact}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Next Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recommended Actions</h3>
          </div>
          {actionItems.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">No actions identified.</p>
          ) : (
            <ul className="space-y-4">
              {actionItems.map((action, idx) => (
                <li key={idx} className="flex gap-4 p-4 rounded-xl border border-slate-200 border-l-4 border-l-blue-500">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-slate-900">{action.title}</h4>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-500"><Clock className="w-3 h-3" /> {action.due}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{action.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
