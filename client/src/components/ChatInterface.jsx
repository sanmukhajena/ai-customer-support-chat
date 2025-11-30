import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { chatStore } from '../stores/ChatStore';
import { Send, Bot, User, Sparkles, Paperclip, Smile } from 'lucide-react';

const ChatInterface = observer(() => {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historySplitIndex, setHistorySplitIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const initChat = async () => {
      if (!hasLoadedRef.current) {
        await chatStore.loadChat('session-1'); // Default session for now
        setHistorySplitIndex(chatStore.messages.length);
        hasLoadedRef.current = true;
      }
    };
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatStore.messages, showHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || chatStore.isLoading) return;

    const message = input;
    setInput('');
    await chatStore.sendMessage(message);
  };

  const historyMessages = chatStore.messages.slice(0, historySplitIndex);
  const newMessages = chatStore.messages.slice(historySplitIndex);

  return (
    <div className="h-full flex flex-col relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Header */}
      <header className="px-8 py-6 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur-md flex justify-between items-center z-10 sticky top-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">AI Assistant</span>
            <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">Beta</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Powered by Gemini • Always here to help</p>
        </div>
        <div className="flex items-center gap-4">
          {historyMessages.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm font-semibold text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-800 hover:shadow-sm"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">Online</span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 scroll-smooth">
        {chatStore.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
            <div className="w-28 h-28 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-[2rem] flex items-center justify-center shadow-inner relative overflow-hidden group border border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Sparkles className="w-14 h-14 text-orange-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="max-w-md space-y-3">
              <h2 className="text-3xl font-bold text-white">How can I help you today?</h2>
              <p className="text-slate-400 text-lg">I can answer questions about our products, services, or help you navigate the platform.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mt-8">
              {['What is the return policy?', 'How do I track my order?', 'Contact support', 'Product warranty'].map((q, i) => (
                <button key={i} onClick={() => setInput(q)} className="p-5 text-left bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-orange-500/10 rounded-2xl transition-all duration-300 group">
                  <span className="text-slate-300 font-medium group-hover:text-orange-500 transition-colors">{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* History Messages */}
        {showHistory && historyMessages.map((msg, idx) => (
          <div key={`hist-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in opacity-60 hover:opacity-100 transition-opacity duration-300`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-4`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-800' : 'bg-slate-800'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-400" /> : <Bot className="w-5 h-5 text-slate-400" />}
              </div>
              <div className={`p-6 rounded-3xl shadow-sm relative group transition-all duration-200 ${msg.role === 'user'
                ? 'bg-slate-800 text-slate-300 rounded-br-none border border-slate-700'
                : 'bg-slate-900 border border-slate-800 text-slate-400 rounded-bl-none'
                }`}>
                <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</p>
                <span className="text-[10px] text-slate-500 absolute bottom-2 right-4 font-medium uppercase tracking-wider">History</span>
              </div>
            </div>
          </div>
        ))}

        {/* Separator if history is shown and there are new messages */}
        {showHistory && historyMessages.length > 0 && newMessages.length > 0 && (
          <div className="flex items-center justify-center py-6">
            <span className="px-4 py-1.5 bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-slate-700">New Messages</span>
          </div>
        )}

        {/* New Messages */}
        {newMessages.map((msg, idx) => (
          <div key={`new-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-4`}>

              {/* Avatar */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20 ${msg.role === 'user' ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-slate-800 border border-slate-700'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-6 h-6 text-orange-500" />}
              </div>

              {/* Bubble */}
              <div className={`p-6 rounded-3xl shadow-md relative group transition-all duration-200 ${msg.role === 'user'
                ? 'bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-br-none hover:shadow-xl hover:shadow-orange-500/20'
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none hover:shadow-xl hover:shadow-black/40'
                }`}>
                <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</p>
                <span className={`text-[10px] absolute bottom-2 ${msg.role === 'user' ? 'left-4 text-orange-200' : 'right-4 text-slate-500'} opacity-0 group-hover:opacity-100 transition-opacity font-medium`}>
                  Just now
                </span>
              </div>
            </div>
          </div>
        ))}

        {chatStore.isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex flex-row items-end gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-6 h-6 text-orange-500" />
              </div>
              <div className="bg-slate-800 border border-slate-700 p-5 rounded-3xl rounded-bl-none shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#0f172a]/80 backdrop-blur-xl border-t border-slate-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center gap-3">
          <div className="absolute left-4 text-slate-500 hover:text-orange-500 cursor-pointer transition-colors p-2 hover:bg-slate-800 rounded-xl">
            <Paperclip className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full pl-14 pr-16 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 focus:bg-slate-900 transition-all shadow-inner text-slate-200 placeholder-slate-500 font-medium"
          />

          <div className="absolute right-3 flex items-center gap-1">
            <button type="button" className="p-2 text-slate-500 hover:text-orange-500 transition-colors hover:bg-slate-800 rounded-xl">
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || chatStore.isLoading}
              className="p-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-slate-500 mt-3 font-medium">AI can make mistakes. Please verify important information.</p>
      </div>
    </div>
  );
});

export default ChatInterface;
