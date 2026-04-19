import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Info, ShieldAlert, Loader2, ChevronDown, ChevronUp, ArrowRight, User, Users, Zap, Bell } from 'lucide-react';
import clsx from 'clsx';

function ApprovalChain({ chain }) {
  if (!chain) return null;

  const steps = [
    {
      label: 'Decided By',
      icon: <User className="w-3.5 h-3.5" />,
      value: chain.decidedBy,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      dot: 'bg-blue-500',
    },
    {
      label: 'Agreed By',
      icon: <Users className="w-3.5 h-3.5" />,
      value: Array.isArray(chain.agreedBy) ? chain.agreedBy.join(', ') : chain.agreedBy,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      dot: 'bg-emerald-500',
    },
    {
      label: 'Action Owner',
      icon: <Zap className="w-3.5 h-3.5" />,
      value: chain.actionOwner,
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      dot: 'bg-amber-500',
    },
    {
      label: 'Must Notify',
      icon: <Bell className="w-3.5 h-3.5" />,
      value: Array.isArray(chain.shouldNotify) ? chain.shouldNotify.join(', ') : chain.shouldNotify,
      color: 'bg-red-50 border-red-200 text-red-700',
      dot: 'bg-red-400',
    },
  ].filter(s => s.value && s.value !== 'Not specified' && s.value.trim() !== '' && s.value !== 'Not specified,');

  if (steps.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Approval Chain</p>
      <div className="flex flex-wrap items-center gap-1">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${step.color}`}>
              {step.icon}
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-60 mr-0.5">{step.label}:</span>
              <span>{step.value}</span>
            </div>
            {idx < steps.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function DecisionIntelligence({ data }) {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState({});

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
  const statuses = ['All', ...new Set(decisions.map(d => d.status))];

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

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

  const filtered = decisions.filter(d => filter === 'All' || d.status === filter);
  const counts = {
    Contradiction: decisions.filter(d => d.status === 'Contradiction').length,
    Risk: decisions.filter(d => d.status === 'Risk').length,
    Pending: decisions.filter(d => d.status === 'Pending').length,
    Approved: decisions.filter(d => d.status === 'Approved').length,
  };

  return (
    <div className="p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Decision Intelligence</h1>
          <p className="text-slate-500">AI-extracted decisions, approval chains, and risks from your documents.</p>
        </div>
      </header>

      {/* Summary pills */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { label: 'Contradictions', count: counts.Contradiction, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Risks', count: counts.Risk, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'Pending', count: counts.Pending, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Approved', count: counts.Approved, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${color}`}>
            <span className="text-lg font-bold">{count}</span> {label}
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm w-fit mb-6">
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

      {decisions.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400">No decisions extracted from the uploaded documents.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(decision => {
            const isOpen = expanded[decision.id];
            return (
              <div key={decision.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Header row — always visible */}
                <div
                  className="flex justify-between items-center p-5 cursor-pointer"
                  onClick={() => toggleExpand(decision.id)}
                >
                  <div className="flex gap-3 items-center">
                    {getStatusIcon(decision.status)}
                    <h3 className="text-base font-bold text-slate-900">{decision.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={getStatusBadge(decision.status)}>{decision.status}</span>
                    <span className="text-slate-300 text-xs font-medium">{decision.date}</span>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />
                    }
                  </div>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{decision.description}</p>

                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Business Impact</p>
                      <p className="text-sm font-medium text-slate-800">{decision.impact}</p>
                    </div>

                    <ApprovalChain chain={decision.chain} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
