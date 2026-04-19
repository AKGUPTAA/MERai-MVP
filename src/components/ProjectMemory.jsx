import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Search, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { chatWithMemory } from '../services/openai';

const DEMO_QUESTIONS = [
  "What decisions were made in this meeting?",
  "Who approved the material specification change?",
  "What items are still unresolved or pending?",
  "Are there any contradictions between documents?",
  "What is the current status of the handover dossier?",
  "Who needs to be notified about recent changes?",
];

export default function ProjectMemory({ apiKey, documentContext, fileNames }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello. I've indexed your uploaded documents. Ask me anything — decisions made, who approved what, unresolved items, contradictions, timelines, or any detail from the files."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim() || !apiKey) return;

    const userMessage = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await chatWithMemory(
        apiKey,
        documentContext,
        messages.filter(m => m.id !== 1),
        text
      );

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponse,
        citations: fileNames && fileNames.length > 0 ? fileNames : []
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "API Error: Unable to reach Gemini. Please check that you have entered a valid API Key in the Settings menu.",
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const hasConversation = messages.length === 1;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Memory</h1>
        <p className="text-slate-500">Ask natural questions, get sourced answers from your uploaded documents.</p>
      </header>

      {!apiKey && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">Please add your Gemini API Key in Settings to enable the chat model.</p>
        </div>
      )}

      <div className="flex-1 overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={clsx("flex gap-4 max-w-3xl", msg.sender === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1", msg.sender === 'user' ? "bg-slate-900" : "bg-blue-600")}>
                {msg.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={clsx("flex flex-col gap-2", msg.sender === 'user' ? "items-end" : "items-start")}>
                <div className={clsx("px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap",
                  msg.sender === 'user'
                    ? "bg-slate-900 text-white rounded-tr-sm"
                    : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm"
                )}>
                  {msg.text}
                </div>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.citations.map((cite, i) => (
                      <span key={i} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 cursor-default">
                        <FileText className="w-3 h-3 text-blue-500" /> {cite}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.15s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.3s]"></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Demo questions — shown only before first user message */}
        {hasConversation && apiKey && (
          <div className="px-6 pb-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Try asking</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={isTyping}
                  className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={apiKey ? "Ask anything about your project files..." : "API Key required..."}
              disabled={!apiKey || isTyping}
              className="w-full pl-12 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400 text-[15px] disabled:opacity-50 disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping || !apiKey}
              className="absolute right-3 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[11px] text-slate-400 tracking-wide">
              {!documentContext ? "Upload files on the main page to populate document context." : `${fileNames?.length || 0} file(s) indexed.`} Powered by Gemini.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
