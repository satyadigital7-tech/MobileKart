import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = '919876543210'; // WhatsApp number

  const quickActions = [
    'Hi! I want to check screen repair price for my phone.',
    'Hi! Is doorstep mobile repair available in my area?',
    'Hi! I need urgent battery replacement in Hyderabad.',
    'Hi! I have a question about my accessories order.'
  ];

  const handleSend = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full absolute bottom-0 right-0"></span>
              </div>
              <div>
                <div className="font-bold text-sm">MobileKart™ Support</div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>● Online</span> • Instant Support
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-950 space-y-3">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <p className="font-semibold text-teal-400 mb-1">Namaste! 👋 How can we help your phone today?</p>
              <p className="text-[11px] text-slate-400">Ask us about accessories stock, doorstep repair slots, or repair price quotes in Hyderabad.</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick Prompts</div>
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action)}
                  className="w-full text-left bg-slate-900/80 hover:bg-teal-950/60 border border-slate-800 hover:border-teal-500/50 p-2 rounded-lg text-xs text-slate-300 hover:text-teal-300 transition flex items-center justify-between"
                >
                  <span className="truncate pr-2">{action}</span>
                  <Send className="w-3 h-3 text-teal-400 shrink-0" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your phone issue..."
                className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 outline-none focus:border-teal-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customMsg.trim()) {
                    handleSend(customMsg);
                  }
                }}
              />
              <button
                onClick={() => customMsg.trim() && handleSend(customMsg)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-3.5 rounded-full shadow-2xl shadow-emerald-900/50 hover:scale-105 transition duration-300"
      >
        <MessageCircle className="w-6 h-6 animate-bounce" />
        <span className="font-bold text-xs pr-1">WhatsApp Support</span>
        <span className="flex h-3 w-3 absolute -top-1 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </button>
    </div>
  );
};
