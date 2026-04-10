import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Settings, Database, Wrench, Brain, FileText, User, Bot, Terminal, GitCommit, Split, BookTemplate, Save, Trash2, CheckCircle2, BarChart, Info } from 'lucide-react';

interface PromptVersion {
  id: string;
  name: string;
  text: string;
  timestamp: number;
}

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  trace?: string[];
  // For A/B Testing
  isABTest?: boolean;
  responses?: {
    a: { content: string; trace: string[]; versionId: string; score: number };
    b: { content: string; trace: string[]; versionId: string; score: number };
  };
}

const Tooltip = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block ml-1.5 align-middle" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Info size={14} className="text-[var(--color-ink)]/30 hover:text-[var(--color-ink)] transition-colors cursor-help" />
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--color-ink)] text-white text-[10px] leading-relaxed rounded-lg w-56 z-50 shadow-2xl pointer-events-none text-center"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--color-ink)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PROMPT_TEMPLATES = [
  {
    id: 'react',
    name: 'ReAct (Reason + Act)',
    description: 'Forces the agent to think step-by-step before acting.',
    text: `You are an AI agent that runs in a loop of Thought, Action, PAUSE, Observation.
At the end of the loop you output an Answer.
Use Thought to describe your thoughts about the question you have been asked.
Use Action to run one of the actions available to you.
Observation will be the result of running those actions.`
  },
  {
    id: 'support',
    name: 'Tier-1 Support Persona',
    description: 'Empathetic customer service agent with strict boundaries.',
    text: `You are a tier-1 support agent. 
1. Always be empathetic and polite.
2. Never guess company policies. If unsure, ask the user to wait for a human.
3. Use available tools to check order statuses or process refunds.
4. Keep responses under 3 sentences.`
  },
  {
    id: 'json',
    name: 'Strict JSON Extractor',
    description: 'Agent that only outputs valid JSON data.',
    text: `You are a data extraction bot. 
Analyze the user's input and extract the intent and key entities.
You MUST output ONLY valid JSON. No conversational text, no markdown blocks.
Format: { "intent": string, "entities": { [key]: string }, "confidence": number }`
  }
];

export default function Sandbox() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'config' | 'library'>('prompt');
  
  // Prompt State
  const [currentPrompt, setCurrentPrompt] = useState(PROMPT_TEMPLATES[1].text);
  const [versions, setVersions] = useState<PromptVersion[]>([
    { id: 'v1', name: 'Initial Version', text: PROMPT_TEMPLATES[1].text, timestamp: Date.now() }
  ]);
  const [activeVersionId, setActiveVersionId] = useState<string>('v1');
  
  // A/B Testing State
  const [isABTesting, setIsABTesting] = useState(false);
  const [versionA, setVersionA] = useState<string>('v1');
  const [versionB, setVersionB] = useState<string>('v1');

  // Config State
  const [llm, setLlm] = useState<'fast' | 'balanced' | 'advanced'>('balanced');
  const [tools, setTools] = useState({ kb: true, orders: true, refund: false });
  const [memory, setMemory] = useState<'none' | 'conversation' | 'long'>('conversation');

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSaveVersion = () => {
    const newId = `v${versions.length + 1}`;
    const newVersion = {
      id: newId,
      name: `Version ${versions.length + 1}`,
      text: currentPrompt,
      timestamp: Date.now()
    };
    setVersions([newVersion, ...versions]);
    setActiveVersionId(newId);
    if (!isABTesting) {
      setVersionA(newId);
    }
  };

  const loadTemplate = (text: string) => {
    setCurrentPrompt(text);
    setActiveTab('prompt');
  };

  const generateMockResponse = (promptText: string, userInput: string) => {
    let response = "";
    const trace: string[] = [];
    const lowerInput = userInput.toLowerCase();
    const lowerPrompt = promptText.toLowerCase();

    trace.push(`[System] Initialized with prompt length: ${promptText.length} chars`);
    const modelName = llm === 'advanced' ? 'Advanced (High-Reasoning)' : llm === 'balanced' ? 'Balanced (Standard)' : 'Fast (Low-Latency)';
    trace.push(`[LLM] Using ${modelName} Model`);

    // Memory Simulation
    if (memory === 'conversation') {
      trace.push(`[Memory] Retrieved last 5 messages from conversation history.`);
    } else if (memory === 'long') {
      trace.push(`[Memory] Querying Long-Term Vector DB for user profile and past interactions...`);
      trace.push(`[Memory] Found: User is a "Gold" member with 3 past orders.`);
    } else {
      trace.push(`[Memory] No memory enabled. Processing as stateless request.`);
    }

    // Tool Simulation
    let toolUsed = false;
    if ((lowerInput.includes("order") || lowerInput.includes("track")) && tools.orders) {
      trace.push(`[Tool] Calling Order_Database_API...`);
      trace.push(`[Tool] Success: Order #12345 is shipped.`);
      response = "Your order #12345 has been shipped and is on its way.";
      toolUsed = true;
    } else if (lowerInput.includes("refund") && tools.refund) {
      trace.push(`[Tool] Calling Stripe_Refund_API...`);
      trace.push(`[Tool] Success: Refund initiated.`);
      response = "I have successfully processed your refund.";
      toolUsed = true;
    } else if (tools.kb && (lowerInput.includes("policy") || lowerInput.includes("help"))) {
      trace.push(`[Tool] Querying Vector_Knowledge_Base...`);
      trace.push(`[Tool] Success: Found relevant article.`);
      response = "According to our policy, you can return items within 30 days.";
      toolUsed = true;
    }

    if (!toolUsed) {
      response = `I understand you're asking about "${userInput}". How can I assist further?`;
    }

    // Prompt Formatting Simulation
    if (lowerPrompt.includes("json")) {
      response = `{\n  "intent": "${toolUsed ? 'support_query' : 'general'}",\n  "response": "${response}",\n  "confidence": 0.95\n}`;
      trace.push(`[Format] Enforced strict JSON output based on system prompt.`);
    } else if (lowerPrompt.includes("react") || lowerPrompt.includes("thought")) {
      response = `Thought: I need to address the user's input.\nAction: RespondToUser\nObservation: ${response}\nAnswer: ${response}`;
      trace.push(`[Pattern] Executed ReAct loop based on system prompt.`);
    } else if (lowerPrompt.includes("empathetic")) {
      response = `I completely understand how important this is. ${response} Please let me know if you need anything else!`;
      trace.push(`[Persona] Applied empathetic tone based on system prompt.`);
    }

    // Calculate a fake "effectiveness score" based on prompt length and tool usage
    const score = Math.min(100, Math.floor(70 + (promptText.length / 50) + (toolUsed ? 15 : 0) + (Math.random() * 10)));

    return { response, trace, score };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      if (isABTesting) {
        const promptAText = versions.find(v => v.id === versionA)?.text || currentPrompt;
        const promptBText = versions.find(v => v.id === versionB)?.text || currentPrompt;

        const resA = generateMockResponse(promptAText, userMsg.content);
        const resB = generateMockResponse(promptBText, userMsg.content);

        const agentMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: '',
          isABTest: true,
          responses: {
            a: { content: resA.response, trace: resA.trace, versionId: versionA, score: resA.score },
            b: { content: resB.response, trace: resB.trace, versionId: versionB, score: resB.score }
          }
        };
        setMessages(prev => [...prev, agentMsg]);
      } else {
        const res = generateMockResponse(currentPrompt, userMsg.content);
        const agentMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: res.response,
          trace: res.trace
        };
        setMessages(prev => [...prev, agentMsg]);
      }
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-white">
      {/* Left Panel: Playground Controls */}
      <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[var(--color-ink)]/10 bg-[var(--color-paper)] flex flex-col h-[50vh] lg:h-full overflow-hidden">
        
        {/* Tabs */}
        <div className="flex items-center border-b border-[var(--color-ink)]/10 px-6 pt-6 bg-white/50 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'prompt' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70'}`}
          >
            <Terminal size={16} /> Prompt Editor
            {activeTab === 'prompt' && <motion.div layoutId="sandboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />}
          </button>
          <button 
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'library' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70'}`}
          >
            <BookTemplate size={16} /> Library
            {activeTab === 'library' && <motion.div layoutId="sandboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />}
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'config' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70'}`}
          >
            <Settings size={16} /> Simulator Config
            {activeTab === 'config' && <motion.div layoutId="sandboxTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'prompt' && (
              <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 h-full flex flex-col">
                
                {/* A/B Test Toggle */}
                <div className="flex items-center justify-between p-4 bg-white border border-[var(--color-ink)]/10 rounded-xl shadow-sm">
                  <div>
                    <h3 className="font-bold flex items-center gap-2"><Split size={16}/> A/B Testing Mode</h3>
                    <p className="text-xs text-[var(--color-ink)]/60 mt-1">Compare two prompt versions side-by-side in the simulator.</p>
                  </div>
                  <button 
                    onClick={() => setIsABTesting(!isABTesting)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isABTesting ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-ink)]/20'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isABTesting ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {isABTesting ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--color-ink)]/60">Version A</label>
                      <select 
                        value={versionA} 
                        onChange={(e) => setVersionA(e.target.value)}
                        className="w-full p-2 rounded-lg border border-[var(--color-ink)]/20 bg-white text-sm focus:ring-2 focus:ring-[var(--color-ink)]/20 outline-none"
                      >
                        {versions.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--color-ink)]/60">Version B</label>
                      <select 
                        value={versionB} 
                        onChange={(e) => setVersionB(e.target.value)}
                        className="w-full p-2 rounded-lg border border-[var(--color-ink)]/20 bg-white text-sm focus:ring-2 focus:ring-[var(--color-ink)]/20 outline-none"
                      >
                        {versions.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <select 
                        value={activeVersionId} 
                        onChange={(e) => {
                          setActiveVersionId(e.target.value);
                          const v = versions.find(ver => ver.id === e.target.value);
                          if (v) setCurrentPrompt(v.text);
                        }}
                        className="p-2 rounded-lg border border-[var(--color-ink)]/20 bg-white text-sm font-semibold focus:ring-2 focus:ring-[var(--color-ink)]/20 outline-none"
                      >
                        {versions.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                      <button 
                        onClick={handleSaveVersion}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-ink)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Save size={14} /> Save Version
                      </button>
                    </div>
                    
                    <textarea
                      value={currentPrompt}
                      onChange={(e) => setCurrentPrompt(e.target.value)}
                      placeholder="Enter system prompt here..."
                      className="flex-1 w-full p-4 rounded-xl border border-[var(--color-ink)]/20 bg-white font-mono text-sm resize-none focus:ring-2 focus:ring-[var(--color-ink)]/20 outline-none shadow-inner min-h-[300px]"
                    />
                  </div>
                )}

                {/* Version History List */}
                {!isABTesting && (
                  <div className="pt-4 border-t border-[var(--color-ink)]/10">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><GitCommit size={16}/> Version History</h3>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                      {versions.map(v => (
                        <div key={v.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--color-ink)]/10 text-sm">
                          <div>
                            <span className="font-semibold">{v.name}</span>
                            <span className="text-[var(--color-ink)]/40 ml-2 text-xs">{new Date(v.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <button 
                            onClick={() => {
                              setActiveVersionId(v.id);
                              setCurrentPrompt(v.text);
                            }}
                            className="text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] font-medium"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'library' && (
              <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h3 className="text-lg font-bold mb-4">Prompt Pattern Library</h3>
                {PROMPT_TEMPLATES.map(template => (
                  <div key={template.id} className="p-5 bg-white border border-[var(--color-ink)]/10 rounded-xl shadow-sm hover:border-[var(--color-ink)]/30 transition-colors group">
                    <h4 className="font-bold text-base mb-1">{template.name}</h4>
                    <p className="text-sm text-[var(--color-ink)]/60 mb-4">{template.description}</p>
                    <div className="bg-[var(--color-paper)] p-3 rounded-lg font-mono text-xs text-[var(--color-ink)]/80 mb-4 line-clamp-3">
                      {template.text}
                    </div>
                    <button 
                      onClick={() => loadTemplate(template.text)}
                      className="w-full py-2 bg-[var(--color-ink)]/5 text-[var(--color-ink)] rounded-lg text-sm font-semibold group-hover:bg-[var(--color-ink)] group-hover:text-white transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'config' && (
              <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Brain size={18}/> LLM Engine</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button 
                      onClick={() => setLlm('fast')}
                      className={`p-3 rounded-xl border text-left transition-all ${llm === 'fast' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">Fast Model</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">Optimized for speed and low latency. Best for simple tasks.</div>
                    </button>
                    <button 
                      onClick={() => setLlm('balanced')}
                      className={`p-3 rounded-xl border text-left transition-all ${llm === 'balanced' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">Balanced Model</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">A middle ground offering reliable reasoning with moderate speed.</div>
                    </button>
                    <button 
                      onClick={() => setLlm('advanced')}
                      className={`p-3 rounded-xl border text-left transition-all ${llm === 'advanced' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">Advanced Model</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">Maximum reasoning power for complex, ambiguous tasks.</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Wrench size={18}/> Tools & APIs</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-ink)]/10 bg-white cursor-pointer hover:border-[var(--color-ink)]/30 transition-all">
                      <div>
                        <div className="font-semibold text-sm flex items-center">
                          Knowledge Base API
                          <Tooltip text="Provides the agent with access to a vector-indexed repository of company policies, FAQs, and technical documentation. Essential for accurate, policy-compliant responses." />
                        </div>
                        <div className="text-xs text-[var(--color-ink)]/60">Access internal documentation & FAQs.</div>
                      </div>
                      <input type="checkbox" checked={tools.kb} onChange={(e) => setTools({...tools, kb: e.target.checked})} className="w-4 h-4 accent-[var(--color-ink)]" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-ink)]/10 bg-white cursor-pointer hover:border-[var(--color-ink)]/30 transition-all">
                      <div>
                        <div className="font-semibold text-sm flex items-center">
                          Order Database API
                          <Tooltip text="Enables real-time retrieval of customer order details, shipping status, and tracking numbers from the internal fulfillment system. Allows agents to resolve logistics queries autonomously." />
                        </div>
                        <div className="text-xs text-[var(--color-ink)]/60">Check shipping & order status.</div>
                      </div>
                      <input type="checkbox" checked={tools.orders} onChange={(e) => setTools({...tools, orders: e.target.checked})} className="w-4 h-4 accent-[var(--color-ink)]" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-ink)]/10 bg-white cursor-pointer hover:border-[var(--color-ink)]/30 transition-all">
                      <div>
                        <div className="font-semibold text-sm flex items-center">
                          Stripe Refund API
                          <Tooltip text="Integrates with the payment processor to initiate and track transaction reversals. Includes safety checks for refund eligibility and amount limits based on company policy." />
                        </div>
                        <div className="text-xs text-[var(--color-ink)]/60">Process transaction reversals.</div>
                      </div>
                      <input type="checkbox" checked={tools.refund} onChange={(e) => setTools({...tools, refund: e.target.checked})} className="w-4 h-4 accent-[var(--color-ink)]" />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Database size={18}/> Memory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button 
                      onClick={() => setMemory('none')}
                      className={`p-3 rounded-xl border text-left transition-all ${memory === 'none' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">None</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">Stateless execution. No context is preserved between messages.</div>
                    </button>
                    <button 
                      onClick={() => setMemory('conversation')}
                      className={`p-3 rounded-xl border text-left transition-all ${memory === 'conversation' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">Short-Term</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">Conversation History. Maintains context of the current session.</div>
                    </button>
                    <button 
                      onClick={() => setMemory('long')}
                      className={`p-3 rounded-xl border text-left transition-all ${memory === 'long' ? 'border-[var(--color-ink)] bg-white shadow-sm' : 'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30'}`}
                    >
                      <div className="font-semibold text-sm">Long-Term</div>
                      <div className="text-xs text-[var(--color-ink)]/60 mt-1">Vector DB. Accesses historical data and user profiles across sessions.</div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel: Chat & Simulator */}
      <div className="w-full lg:w-1/2 flex flex-col h-[50vh] lg:h-full bg-white relative border-t lg:border-t-0 border-[var(--color-ink)]/10">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-[var(--color-ink)]/10 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-paper)] border border-[var(--color-ink)]/10 flex items-center justify-center">
              <Bot size={20} className="text-[var(--color-ink)]" />
            </div>
            <div>
              <h2 className="font-bold">Agent Simulator</h2>
              <div className="flex items-center gap-2 text-xs text-[var(--color-ink)]/60">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> {isABTesting ? 'A/B Test Mode Active' : 'Online'}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="p-2 text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-ink)]/40 space-y-4">
              <Bot size={48} className="opacity-20" />
              <p className="text-center max-w-sm">Configure your prompt and agent settings on the left, then send a message to test the behavior.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* User Message */}
              {msg.role === 'user' && (
                <div className="flex items-end gap-2 max-w-[85%] flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-ink)] text-white flex items-center justify-center flex-shrink-0">
                    <User size={14} />
                  </div>
                  <div className="p-4 rounded-2xl bg-[var(--color-ink)] text-white rounded-br-sm">
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              )}

              {/* Agent Message (Standard) */}
              {msg.role === 'agent' && !msg.isABTest && (
                <div className="flex flex-col items-start w-full max-w-[90%]">
                  <div className="flex items-end gap-2 w-full">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-paper)] border border-[var(--color-ink)]/10 text-[var(--color-ink)] flex items-center justify-center flex-shrink-0">
                      <Bot size={14} />
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--color-paper)] text-[var(--color-ink)] rounded-bl-sm border border-[var(--color-ink)]/5 w-full">
                      <pre className="leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</pre>
                    </div>
                  </div>
                  
                  {/* Agent Trace Logs */}
                  {msg.trace && (
                    <div className="mt-2 ml-10 w-full">
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
              )}

              {/* Agent Message (A/B Test Split) */}
              {msg.role === 'agent' && msg.isABTest && msg.responses && (
                <div className="w-full mt-4">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-[1px] flex-1 bg-[var(--color-ink)]/10"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]/40 flex items-center gap-2"><Split size={14}/> A/B Comparison</span>
                    <div className="h-[1px] flex-1 bg-[var(--color-ink)]/10"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Response A */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-bold text-[var(--color-ink)]/60">Version A ({versions.find(v => v.id === msg.responses!.a.versionId)?.name})</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><BarChart size={12}/> Score: {msg.responses.a.score}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-ink)]/10 h-full">
                        <pre className="leading-relaxed whitespace-pre-wrap font-sans text-sm">{msg.responses.a.content}</pre>
                      </div>
                      <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-3 rounded-xl font-mono text-[10px] space-y-1 shadow-inner">
                        {msg.responses.a.trace.map((log, idx) => (
                          <div key={idx} className="opacity-90 leading-relaxed truncate" title={log}>
                            <span className="text-green-400 mr-1">{'>'}</span>{log}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Response B */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-bold text-[var(--color-ink)]/60">Version B ({versions.find(v => v.id === msg.responses!.b.versionId)?.name})</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><BarChart size={12}/> Score: {msg.responses.b.score}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-ink)]/10 h-full">
                        <pre className="leading-relaxed whitespace-pre-wrap font-sans text-sm">{msg.responses.b.content}</pre>
                      </div>
                      <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-3 rounded-xl font-mono text-[10px] space-y-1 shadow-inner">
                        {msg.responses.b.trace.map((log, idx) => (
                          <div key={idx} className="opacity-90 leading-relaxed truncate" title={log}>
                            <span className="text-green-400 mr-1">{'>'}</span>{log}
                          </div>
                        ))}
                      </div>
                    </div>
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
              placeholder="Test your agent's behavior..."
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
