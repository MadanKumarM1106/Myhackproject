import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Minimize2, Maximize2, Cpu } from 'lucide-react';
import { sendTacticalQuery } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const CommandTerminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'WARCOM ONLINE. AWAITING ORDERS.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await sendTacticalQuery(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'CONNECTION INTERRUPTED.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'w-96 h-[500px]' : 'w-64 h-12'}`}>
      
      {/* Header / Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between px-4 py-2 cursor-pointer border border-military-600
          bg-military-900 text-military-500 hover:bg-military-800 transition-colors
          ${isOpen ? 'rounded-t-lg border-b-0' : 'rounded-lg shadow-lg'}
        `}
      >
        <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider">
          <Cpu size={16} className={isTyping ? 'animate-pulse' : ''} />
          <span>WARCOM AI CHAT</span>
        </div>
        {isOpen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </div>

      {/* Chat Body */}
      {isOpen && (
        <div className="flex-1 flex flex-col bg-black/90 border-x border-b border-military-600 rounded-b-lg shadow-[0_0_30px_rgba(74,222,128,0.15)] backdrop-blur-sm">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[85%] p-2 rounded-sm border
                  ${msg.role === 'user' 
                    ? 'bg-military-800/50 border-military-600 text-gray-300 text-right' 
                    : 'bg-military-900/80 border-military-500 text-military-400 shadow-[0_0_10px_rgba(74,222,128,0.1)]'}
                `}>
                  <p className="leading-tight">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="text-military-600 text-xs animate-pulse">PROCESSING...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-2 border-t border-military-700 bg-military-900/50">
            <div className="relative flex items-center">
              <Terminal size={14} className="absolute left-3 text-military-600" />
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter command..."
                className="w-full bg-black/50 border border-military-700 rounded text-military-400 pl-9 pr-10 py-2 text-xs font-mono focus:outline-none focus:border-military-500 focus:ring-1 focus:ring-military-500"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 text-military-500 hover:text-military-400 disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommandTerminal;