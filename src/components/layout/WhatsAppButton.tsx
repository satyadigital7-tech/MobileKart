import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = '919849129508'; // WhatsApp number

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
                  <svg className="w-6 h-6 fill-current text-white shrink-0" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.483 1.334 5.003L2 22l5.127-1.341c1.464.798 3.111 1.218 4.881 1.219h.004c5.505 0 9.989-4.478 9.99-9.985 0-2.668-1.039-5.176-2.925-7.061A9.923 9.923 0 0 0 12.012 2zm.004 16.634h-.003a8.31 8.31 0 0 1-4.238-1.164l-.304-.181-3.148.823.839-3.067-.198-.316a8.314 8.314 0 0 1-1.277-4.444c.001-4.59 3.738-8.324 8.334-8.324 2.225 0 4.316.866 5.89 2.441 1.574 1.575 2.44 3.666 2.44 5.892 0 4.591-3.737 8.325-8.335 8.325zm4.567-6.236c-.251-.126-1.484-.732-1.714-.816-.23-.084-.398-.126-.566.126-.168.251-.649.816-.795.983-.146.168-.293.188-.544.063-1.616-.807-2.678-1.437-3.754-3.277-.142-.243.143-.226.409-.757.063-.126.031-.237-.016-.334-.047-.097-.419-1.009-.574-1.381-.151-.362-.305-.313-.419-.319l-.356-.007c-.126 0-.334.047-.502.23-.168.183-.649.634-.649 1.546 0 .912.664 1.793.757 1.919.094.126 1.308 1.996 3.168 2.798 1.482.64 1.8.513 2.135.48.566-.056 1.484-.607 1.693-1.193.209-.586.209-1.089.146-1.193-.063-.105-.23-.168-.481-.294z" />
                  </svg>
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
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-900/40 hover:scale-105 transition duration-300 border border-emerald-400/40"
      >
        {/* Authentic WhatsApp SVG Logo */}
        <div className="relative flex items-center justify-center">
          <svg className="w-6 h-6 fill-current text-white shrink-0 drop-shadow-sm" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.483 1.334 5.003L2 22l5.127-1.341c1.464.798 3.111 1.218 4.881 1.219h.004c5.505 0 9.989-4.478 9.99-9.985 0-2.668-1.039-5.176-2.925-7.061A9.923 9.923 0 0 0 12.012 2zm.004 16.634h-.003a8.31 8.31 0 0 1-4.238-1.164l-.304-.181-3.148.823.839-3.067-.198-.316a8.314 8.314 0 0 1-1.277-4.444c.001-4.59 3.738-8.324 8.334-8.324 2.225 0 4.316.866 5.89 2.441 1.574 1.575 2.44 3.666 2.44 5.892 0 4.591-3.737 8.325-8.335 8.325zm4.567-6.236c-.251-.126-1.484-.732-1.714-.816-.23-.084-.398-.126-.566.126-.168.251-.649.816-.795.983-.146.168-.293.188-.544.063-1.616-.807-2.678-1.437-3.754-3.277-.142-.243.143-.226.409-.757.063-.126.031-.237-.016-.334-.047-.097-.419-1.009-.574-1.381-.151-.362-.305-.313-.419-.319l-.356-.007c-.126 0-.334.047-.502.23-.168.183-.649.634-.649 1.546 0 .912.664 1.793.757 1.919.094.126 1.308 1.996 3.168 2.798 1.482.64 1.8.513 2.135.48.566-.056 1.484-.607 1.693-1.193.209-.586.209-1.089.146-1.193-.063-.105-.23-.168-.481-.294z" />
          </svg>
          {/* Integrated Online Pulse Dot */}
          <span className="flex h-2.5 w-2.5 absolute -top-0.5 -right-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300 border border-emerald-600"></span>
          </span>
        </div>

        <span className="font-extrabold text-xs tracking-wide">WhatsApp Support</span>
      </button>
    </div>
  );
};
