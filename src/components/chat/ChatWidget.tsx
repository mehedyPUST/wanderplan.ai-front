"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaComment } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wanderplan-ai-back.vercel.app';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm your AI travel assistant. Ask me anything! ✈️" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: text }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
                credentials: 'include',
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.text) {
                                assistantContent += parsed.text;
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                                    return updated;
                                });
                            }
                        } catch { }
                    }
                }
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 sm:w-96 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FaRobot className="text-xl" />
                                <div>
                                    <h3 className="font-bold text-sm">Travel Assistant</h3>
                                    <p className="text-xs text-purple-100">Powered by DeepSeek AI</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <FaRobot className="text-purple-600 text-xs" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-purple-500 text-white' : 'bg-white border border-gray-200 text-gray-800'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                                            <FaUser className="text-white text-xs" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && messages[messages.length - 1]?.content === '' && (
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                        <FaRobot className="text-purple-600 text-xs" />
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="border-t border-gray-200 p-3 bg-white">
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                                    disabled={loading}
                                />
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => sendMessage(input)}
                                    disabled={loading || !input.trim()}
                                    className="px-4 py-2 bg-purple-500 text-white rounded-xl text-sm hover:bg-purple-600 disabled:opacity-50"
                                >
                                    <FaPaperPlane />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
                {isOpen ? <FaTimes size={20} /> : <FaComment size={20} />}
            </motion.button>
        </div>
    );
}