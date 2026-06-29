import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedProducts?: Product[];
}

interface AIAssistantProps {
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function AIAssistant({ onViewProduct, onAddToCart }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "Welcome to Aura, your premium digital personal stylist. I have perfect access to our live inventory of high-end fashion, noise-cancelling electronics, hand-thrown ceramics, and active botanical serums. \n\nAsk me anything! For example: \n- *'Can you recommend a warm fashion piece?'* \n- *'What goes well with the Clay & Basalt Vase?'* \n- *'Do you have any discount codes?'*",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const quickReplies = [
    { label: '🧥 Suggest a Warm Coat', prompt: 'Can you recommend a luxurious warm fashion piece from your coat collection?' },
    { label: '🎁 Coupon Codes', prompt: 'What active discount coupon codes can you offer me?' },
    { label: '🌿 Aura Facial Nectar details', prompt: 'Tell me about the botanical facial nectar ingredients and benefits.' },
    { label: '🎧 Pair Headphones with Coat', prompt: 'I want to pair the Aether ANC Headphones with a clean fashion look, what do you suggest?' }
  ];

  // Helper to scan text for product mentions and attach interactive cards
  const detectSuggestedProducts = (text: string): Product[] => {
    const found: Product[] = [];
    const lowerText = text.toLowerCase();
    
    PRODUCTS.forEach((product) => {
      // Check if product name, or a simplified version is mentioned
      const nameLower = product.name.toLowerCase();
      const simpleName = product.id.replace('-', ' ');
      
      if (lowerText.includes(nameLower) || lowerText.includes(simpleName) || lowerText.includes(product.id)) {
        if (!found.some(p => p.id === product.id)) {
          found.push(product);
        }
      }
    });
    
    return found;
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Gather chat history (limit last 8 messages to keep model payload light)
      const chatHistory = [...messages, userMsg].slice(-8).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error('Intelligence gateway failed to respond.');
      }

      const data = await response.json();
      
      // Auto-scan response text to find any matching products
      const suggested = detectSuggestedProducts(data.text);

      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
        suggestedProducts: suggested.length > 0 ? suggested : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: "My apologies. It appears I have momentarily disconnected from the luxury server matrix. Please verify your internet link, or let me know if I can guide you through the category tags in the main view!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-black text-white hover:bg-neutral-800 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 z-50 hover:scale-105 active:scale-95 group"
        title="Chat with Stylist Aura"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <Sparkles className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full" />
          </div>
        )}
      </button>

      {/* Floating Chat Panel Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-white border border-gray-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Top Panel Banner */}
          <div className="px-5 py-4 bg-black text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 bg-neutral-800 rounded-xl flex items-center justify-center text-white">
                <Bot className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider font-sans block leading-none">AURA STYLIST</span>
                <span className="text-[9px] font-mono tracking-widest text-green-400 block mt-1 uppercase">● Luxury AI Agent</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Chat Feed */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Bubble message wrapper */}
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Icon avatar */}
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>

                  {/* Message box */}
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    {/* Render basic custom bullet formatting for elegance */}
                    <div className="whitespace-pre-line space-y-1 font-sans">
                      {msg.content}
                    </div>
                  </div>
                </div>

                {/* Display Dynamic Recommended Product Cards (Scanned mentions) */}
                {msg.suggestedProducts && (
                  <div className="mt-3.5 ml-9 w-[80%] space-y-2">
                    <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase font-semibold">Matched Collections</span>
                    {msg.suggestedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => onViewProduct(prod)}
                        className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 shadow-xs hover:border-black cursor-pointer transition-all hover:-translate-y-0.5"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-[11px] font-semibold text-gray-900 truncate leading-none">{prod.name}</h4>
                          <span className="font-mono text-[10px] text-gray-900 block mt-1 font-bold">${prod.price}</span>
                        </div>
                        <button className="self-center p-1 bg-gray-50 text-black rounded-lg hover:bg-black hover:text-white transition-colors">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2 items-center text-gray-400 pl-2">
                <Loader2 className="h-4.5 w-4.5 animate-spin text-gray-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">Aura is consulting catalogs...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply recommendations bar */}
          {messages.length === 1 && !isLoading && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 overflow-x-auto flex gap-2 whitespace-nowrap scrollbar-none">
              {quickReplies.map((qr) => (
                <button
                  key={qr.label}
                  onClick={() => handleSend(qr.prompt)}
                  className="px-3 py-1.5 bg-white border border-gray-150 text-[10px] text-gray-600 hover:text-black hover:border-black rounded-full font-sans transition-all flex items-center gap-1 shrink-0 shadow-xs"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}

          {/* Bottom input area */}
          <div className="p-3.5 border-t border-gray-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Aura..."
                disabled={isLoading}
                className="flex-grow px-4 py-2.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-gray-300 text-black placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-black hover:bg-neutral-800 disabled:bg-gray-100 text-white disabled:text-gray-400 rounded-xl transition-colors shrink-0 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
