import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Info, ShieldAlert, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function DecisionIntelligence({ data }) {
  const [filter, setFilter] = useState('All');

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

  const decisions = data.decisions ?? [];

  // Collect unique statuses for filter buttons
  const statuses = ['All', ...new Set(decisions.map(d => d.status))];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Contradiction': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'Approved': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Pending': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'Risk': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded border";
    switch(status) {
      case 'Contradiction': return clsx(base, "bg-amber-50 text-amber-700 border-amber-200");
      case 'Approved': return clsx(base, "bg-emerald-50 text-emerald-700 border-emerald-200");
      case 'Pending': return clsx(base, "bg-blue-50 text-blue-700 border-blue-200");
      case 'Risk': return clsx(base, "bg-red-50 text-red-700 border-red-200");
      default: return clsx(base, "bg-slate-50 text-slate-700 border-slate-200");
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Decision Intelligence</h1>
          <p className="text-slate-500">AI-extracted decisions, contradictions, and risks from your documents.</p>
        </div>
        <div className="flex gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          {statuses.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                filter === f ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {decisions.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400">No decisions extracted from the uploaded documents.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {decisions.filter(d => filter === 'All' || d.status === filter).map(decision => (
            <div key={decision.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  {getStatusIcon(decision.status)}
                  <h3 className="text-lg font-bold text-slate-900">{decision.title}</h3>
                </div>
                <span className={getStatusBadge(decision.status)}>{decision.status}</span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">{decision.description}</p>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center text-sm">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Impact</span>
                    <span className="text-slate-800 font-medium">{decision.impact}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Owner</span>
                    <span className="text-slate-800 font-medium">{decision.owner}</span>
                  </div>
                </div>
                <span className="text-slate-400 text-xs font-medium">{decision.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
