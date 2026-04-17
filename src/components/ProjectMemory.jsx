import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Search } from 'lucide-react';
import clsx from 'clsx';

export default function ProjectMemory() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello. I've indexed your Meridian Closeout files. You can ask me anything about past decisions, revisions, approvals, or outstanding deliverables."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let aiResponseText = "I found this in the recent engineering review. The water treatment package scope is currently deferred due to a contradiction between FEED Rev 2 and Licensor expectations.";
      
      const lowerInput = userMessage.text.toLowerCase();
      
      if (lowerInput.includes("duplex 2205") || lowerInput.includes("material")) {
        aiResponseText = "According to the April 2nd Transcript, Duplex 2205 was approved for vessels V-2104 through 2106. Dr. Klaus Werner recommended it over SS316L due to chloride stress cracking concerns in the port environment. Note: This adds roughly 1.5 crore in material costs.";
      } else if (lowerInput.includes("100 mw") || lowerInput.includes("electrolyser") || lowerInput.includes("foundation")) {
        aiResponseText = "The foundation loading was increased by 18% because the project confirmed the 100 MW stack configuration. While Arjun Reddy missed the formal note, Kavita Desai confirmed it was communicated via email on March 19th.";
      } else if (lowerInput.includes("storage") || lowerInput.includes("layout")) {
        aiResponseText = "The hydrogen storage layout remains TBD. Option B (split layout) is safer for fire propagation but requires 400m of high-pressure piping. Anil Joshi is expediting a review from the port safety officer by next Thursday.";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        citations: ["Apr 2 Transcript", "19 March Email"].slice(0, Math.floor(Math.random() * 2) + 1)
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Memory</h1>
        <p className="text-slate-500">Ask natural questions, get sourced answers directly from your documents.</p>
      </header>

      <div className="flex-1 overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={clsx("flex gap-4 max-w-3xl", msg.sender === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1", msg.sender === 'user' ? "bg-slate-900" : "bg-blue-600")}>
                {msg.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={clsx("flex flex-col gap-2", msg.sender === 'user' ? "items-end" : "items-start")}>
                <div className={clsx("px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm", 
                  msg.sender === 'user' 
                    ? "bg-slate-900 text-white rounded-tr-sm" 
                    : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm"
                )}>
                  {msg.text}
                </div>
                {msg.citations && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.citations.map((cite, i) => (
                      <span key={i} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded cursor-pointer hover:bg-slate-50">
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
               <div className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm flex items-center gap-1 text-slate-400">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.15s]"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.3s]"></span>
               </div>
             </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400" />
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. Why was Revision 2 chosen instead of 1?"
              className="w-full pl-12 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400 text-[15px]"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-3 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3">
              <span className="text-[11px] text-slate-400 tracking-wide">MERai Memory Agent can make mistakes. Verify critical facts automatically via Handover module.</span>
            </div>
        </div>
      </div>
    </div>
  );
}
