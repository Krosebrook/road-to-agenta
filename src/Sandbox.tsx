import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Settings, Database, Wrench, Brain, FileText, Activity, User, Bot, Terminal, CheckCircle2, XCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  trace?: string[];
}

export default function Sandbox() {
  const [activeTab, setActiveTab] = useState<'config' | 'casestudy'>('config');
  
  // Config State
  const [llm, setLlm] = useState<'fast' | 'advanced'>('advanced');
  const [tools, setTools] = useState({ kb: true, orders: false, refund: false });
  const [memory, setMemory] = useState<'none' | 'short'>('short');

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I am your configurable AI agent. Adjust my settings on the left, then try asking me about an order, a refund, or how to reset a password.',
      trace: ['[System] Agent initialized and ready.']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Agent Processing
    setTimeout(() => {
      const trace: string[] = [];
      let response = "";
      const lowerInput = input.toLowerCase();

      trace.push(`[System] Initializing response generation using ${llm === 'advanced' ? 'High-Reasoning LLM' : 'Fast LLM'}...`);
      
      if (memory === 'short') {
        trace.push(`[Memory] Checking short-term session memory for context...`);
        if (messages.length > 2) {
          trace.push(`[Memory] Retrieved ${messages.length} previous messages for context.`);
        }
      } else {
        trace.push(`[Memory] Memory disabled. Processing as an isolated request.`);
      }

      // Intent Routing & Tool Usage
      if (lowerInput.includes("order") || lowerInput.includes("where is")) {
        trace.push(`[Intent] Classified intent as: Order Status.`);
        if (tools.orders) {
          trace.push(`[Tool] Calling Order_Database_API...`);
          trace.push(`[Tool] Success: Order #12345 is out for delivery.`);
          response = "I checked our system, and your order is currently out for delivery! It should arrive by tonight.";
        } else {
          trace.push(`[Tool] Order_Database_API is disabled. Cannot fetch data.`);
          response = "I'm sorry, but I don't have access to the order database right now. Please contact human support.";
        }
      } else if (lowerInput.includes("refund") || lowerInput.includes("money back")) {
        trace.push(`[Intent] Classified intent as: Refund Request.`);
        if (tools.refund) {
          trace.push(`[Tool] Calling Stripe_Refund_API...`);
          trace.push(`[Tool] Success: Refund initiated.`);
          response = "I have successfully processed your refund. You should see it in your account in 3-5 business days.";
        } else {
          trace.push(`[Tool] Stripe_Refund_API is disabled. Cannot process.`);
          response = "I cannot process refunds directly. Let me connect you with a human agent to handle this transaction safely.";
        }
      } else if (lowerInput.includes("password") || lowerInput.includes("how to")) {
        trace.push(`[Intent] Classified intent as: General Support / FAQ.`);
        if (tools.kb) {
          trace.push(`[Tool] Querying Vector_Knowledge_Base...`);
          trace.push(`[Tool] Success: Found article 'Password Reset'.`);
          response = "To reset your password, please go to the Settings page and click 'Forgot Password'. A reset link will be emailed to you.";
        } else {
          trace.push(`[Tool] Vector_Knowledge_Base is disabled. Relying on base model knowledge.`);
          response = "I'm not exactly sure about our specific policy, but usually, there is a settings page you can check to reset your password.";
        }
      } else {
        trace.push(`[Intent] Classified intent as: General Conversation.`);
        response = "I am here to help! You can ask me about your orders, refunds, or general support questions.";
      }

      if (llm === 'fast') {
        trace.push(`[LLM] Fast generation complete. Outputting response.`);
      } else {
        trace.push(`[LLM] Advanced reasoning applied. Formatting response for empathy and clarity...`);
      }

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response,
        trace
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500); // 1.5s simulated delay
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-white">
      {/* Left Panel: Config & Case Study */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-[var(--color-ink)]/10 bg-[var(--color-paper)] flex flex-col h-[50vh] lg:h-full overflow-hidden">
        
        {/* Tabs */}
        <div className="flex items-center border-b border-[var(--color-ink)]/10 px-6 pt-6 bg-white/50 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'config' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70'}`}
          >
            <Settings size={16} /> Configuration
            {activeTab === 'config' && <motion.div layoutId="sandboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />}
          </button>
          <button 
            onClick={() => setActiveTab('casestudy')}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'casestudy' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70'}`}
          >
            <FileText size={16} /> Case Study
            {activeTab === 'casestudy' && <motion.div layoutId="sandboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'config' ? (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Brain size={18}/> LLM Engine</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setLlm('fast')}
                      className={`p-3 rounded-xl border text-left transition-all ${llm === 'fast' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">Fast Model</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">Low latency, basic reasoning.</div>
                    </button>
                    <button 
                      onClick={() => setLlm('advanced')}
                      className={`p-3 rounded-xl border text-left transition-all ${llm === 'advanced' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">Advanced Model</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">High reasoning, slower.</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Wrench size={18}/> Tools & APIs</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-ink)]/10 bg-white cursor-pointer hover:border-[var(--color-ink)]/30 transition-all">
                      <div>
                        <div className="font-semibold text-sm">Knowledge Base API</div>
                        <div className="text-xs text-[var(--color-ink)]/60">Allows agent to read FAQs.</div>
                      </div>
                      <input type="checkbox" checked={tools.kb} onChange={(e) => setTools({...tools, kb: e.target.checked})} className="w-4 h-4 accent-[var(--color-ink)]" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-ink)]/10 bg-white cursor-pointer hover:border-[var(--color-ink)]/30 transition-all">
                      <div>
                        <div className="font-semibold text-sm">Order Database API</div>
                        <div className="text-xs text-[var(--color-ink)]/60">Allows agent to check shipping.</div>
                      </div>
                      <input type="checkbox" checked={tools.orders} onChange={(e) => setTools({...tools, orders: e.target.checked})} className="w-4 h-4 accent-[var(--color-ink)]" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-ink)]/10 bg-white cursor-pointer hover:border-[var(--color-ink)]/30 transition-all">
                      <div>
                        <div className="font-semibold text-sm">Stripe Refund API</div>
                        <div className="text-xs text-[var(--color-ink)]/60">Allows agent to issue refunds.</div>
                      </div>
                      <input type="checkbox" checked={tools.refund} onChange={(e) => setTools({...tools, refund: e.target.checked})} className="w-4 h-4 accent-[var(--color-ink)]" />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Database size={18}/> Memory</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setMemory('none')}
                      className={`p-3 rounded-xl border text-left transition-all ${memory === 'none' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">None</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">Isolated requests.</div>
                    </button>
                    <button 
                      onClick={() => setMemory('short')}
                      className={`p-3 rounded-xl border text-left transition-all ${memory === 'short' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">Session Context</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">Remembers current chat.</div>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="casestudy"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 text-sm"
              >
                <h3 className="text-xl font-bold">Case Study: Customer Support Agent</h3>
                <p className="text-[var(--color-ink)]/70 text-base">A detailed breakdown of a production-ready AI agent designed to automate tier-1 customer support inquiries.</p>
                
                <div className="space-y-4">
                  <div className="p-5 bg-white border border-[var(--color-ink)]/10 rounded-xl shadow-sm">
                    <h4 className="font-bold flex items-center gap-2 mb-3 text-base"><Brain size={16}/> 1. Agent Role & Persona</h4>
                    <p className="text-[var(--color-ink)]/80 mb-2"><strong>Role:</strong> Tier-1 Support Resolution Agent.</p>
                    <p className="text-[var(--color-ink)]/80"><strong>Persona:</strong> Empathetic, concise, and solution-oriented. Never guesses policies; always relies on the Knowledge Base.</p>
                  </div>

                  <div className="p-5 bg-white border border-[var(--color-ink)]/10 rounded-xl shadow-sm">
                    <h4 className="font-bold flex items-center gap-2 mb-3 text-base"><Wrench size={16}/> 2. Tools & APIs</h4>
                    <ul className="list-disc pl-4 space-y-2 text-[var(--color-ink)]/80">
                      <li><strong>Shopify API:</strong> To fetch order status and tracking links.</li>
                      <li><strong>Stripe API:</strong> To process partial or full refunds within policy limits.</li>
                      <li><strong>Zendesk API:</strong> To escalate complex issues to human agents.</li>
                      <li><strong>Knowledge Base (Vector DB):</strong> To retrieve company policies and FAQs.</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-white border border-[var(--color-ink)]/10 rounded-xl shadow-sm">
                    <h4 className="font-bold flex items-center gap-2 mb-3 text-base"><Database size={16}/> 3. Memory Requirements</h4>
                    <ul className="list-disc pl-4 space-y-2 text-[var(--color-ink)]/80">
                      <li><strong>Short-term (Session):</strong> Maintains context of the current chat (e.g., remembering the order number mentioned 2 messages ago).</li>
                      <li><strong>Long-term (User Profile):</strong> Retrieves past ticket history and user lifetime value (LTV) to personalize the interaction or prioritize routing.</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-white border border-[var(--color-ink)]/10 rounded-xl shadow-sm">
                    <h4 className="font-bold flex items-center gap-2 mb-3 text-base"><Activity size={16}/> 4. Sample Workflow</h4>
                    <ol className="list-decimal pl-4 space-y-2 text-[var(--color-ink)]/80">
                      <li><strong>Ingestion:</strong> User sends "Where is my order?".</li>
                      <li><strong>Context Retrieval:</strong> Agent fetches user's email and recent orders from Long-term memory.</li>
                      <li><strong>Tool Execution:</strong> Agent decides to call the <code>check_order_status</code> tool using the most recent order ID.</li>
                      <li><strong>Evaluation:</strong> Tool returns "Shipped". Agent formulates a polite response with the tracking link.</li>
                      <li><strong>Output & Log:</strong> Agent replies to the user and logs the resolution in Zendesk.</li>
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel: Chat & Trace */}
      <div className="w-full lg:w-2/3 flex flex-col h-[50vh] lg:h-full bg-white relative">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-[var(--color-ink)]/10 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-paper)] border border-[var(--color-ink)]/10 flex items-center justify-center">
              <Bot size={20} className="text-[var(--color-ink)]" />
            </div>
            <div>
              <h2 className="font-bold">Support Agent Simulator</h2>
              <div className="flex items-center gap-2 text-xs text-[var(--color-ink)]/60">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[var(--color-ink)] text-white' : 'bg-[var(--color-paper)] border border-[var(--color-ink)]/10 text-[var(--color-ink)]'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--color-ink)] text-white rounded-br-sm' : 'bg-[var(--color-paper)] text-[var(--color-ink)] rounded-bl-sm border border-[var(--color-ink)]/5'}`}>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              </div>
              
              {/* Agent Trace Logs */}
              {msg.trace && (
                <div className="mt-2 ml-10 max-w-[80%]">
                  <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-3 rounded-xl font-mono text-xs space-y-1.5 shadow-inner">
                    <div className="flex items-center gap-2 mb-2 text-[var(--color-paper)]/50 uppercase tracking-widest text-[10px] font-bold">
                      <Terminal size={12} /> Agent Thought Trace
                    </div>
                    {msg.trace.map((log, idx) => (
                      <div key={idx} className="opacity-90 leading-relaxed">
                        <span className="text-green-400 mr-2">{'>'}</span>{log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-[var(--color-paper)] border border-[var(--color-ink)]/10 text-[var(--color-ink)] flex items-center justify-center flex-shrink-0">
                <Bot size={14} />
              </div>
              <div className="p-4 rounded-2xl bg-[var(--color-paper)] text-[var(--color-ink)] rounded-bl-sm border border-[var(--color-ink)]/5 flex gap-1">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-[var(--color-ink)]/40 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-[var(--color-ink)]/40 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-[var(--color-ink)]/40 rounded-full" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[var(--color-ink)]/10">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about an order, refund, or password reset..."
              className="flex-1 bg-[var(--color-paper)] border border-[var(--color-ink)]/10 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-full bg-[var(--color-ink)] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
