/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, BrainCircuit, ArrowRight, BookOpen, HelpCircle, PlayCircle, XCircle, AlertCircle, LayoutDashboard, Beaker } from 'lucide-react';
import { roadmapData } from './data';
import { Phase, QuizQuestion, SimulatorStep } from './types';
import Sandbox from './Sandbox';

export default function App() {
  const [mainView, setMainView] = useState<'roadmap' | 'sandbox'>('roadmap');
  const [activePhase, setActivePhase] = useState(1);
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'simulate'>('learn');
  const leftPanelRef = useRef<HTMLDivElement>(null);

  // State for Quizzes: { [questionId]: selectedOptionId }
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  
  // State for Simulator: { [phaseId]: selectedChoiceId }
  const [simChoices, setSimChoices] = useState<Record<number, string>>({});

  const currentPhaseData = roadmapData.find(p => p.id === activePhase) || roadmapData[0];

  const handleQuizAnswer = (questionId: string, optionId: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSimChoice = (phaseId: number, choiceId: string) => {
    setSimChoices(prev => ({ ...prev, [phaseId]: choiceId }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)] font-sans selection:bg-[var(--color-ink)] selection:text-[var(--color-paper)]">
      
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-ink)]/10 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center">
            <BrainCircuit size={16} />
          </div>
          <span className="font-mono text-sm tracking-widest uppercase font-bold">Agentic AI</span>
        </div>
        <div className="flex items-center gap-2 bg-[var(--color-ink)]/5 p-1 rounded-full">
          <button 
            onClick={() => setMainView('roadmap')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${mainView === 'roadmap' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]'}`}
          >
            <LayoutDashboard size={16}/> Roadmap
          </button>
          <button 
            onClick={() => setMainView('sandbox')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${mainView === 'sandbox' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]'}`}
          >
            <Beaker size={16}/> Sandbox
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {mainView === 'roadmap' ? (
          <>
            {/* Left Panel - Navigation / Timeline */}
            <div 
              ref={leftPanelRef}
              className="w-full lg:w-1/2 lg:h-[calc(100vh-73px)] lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-[var(--color-ink)]/10 p-6 md:p-12 lg:p-16 xl:p-24"
            >
              <div className="max-w-xl mx-auto lg:mx-0">
                <div className="mb-16">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                    The 10-Phase<br />Roadmap.
                  </h1>
                  <p className="text-lg text-[var(--color-ink)]/60 font-medium max-w-md">
                    Most people miss this while building AI systems. Here is the definitive guide to building agentic AI, from basics to ecosystem contribution.
                  </p>
                </div>

                <div className="space-y-2 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[23px] top-8 bottom-8 w-[2px] bg-[var(--color-ink)]/5 hidden sm:block" />

                  {roadmapData.map((phase) => {
                    const isActive = activePhase === phase.id;
                    const isSimCompleted = !!simChoices[phase.id];
                    return (
                      <button
                        key={phase.id}
                        onClick={() => {
                          setActivePhase(phase.id);
                          setActiveTab('learn');
                        }}
                        className={`w-full text-left group relative flex items-start gap-6 p-4 rounded-2xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[var(--color-ink)]/5' 
                            : 'hover:bg-[var(--color-ink)]/5'
                        }`}
                      >
                        <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300 ${
                          isActive 
                            ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' 
                            : isSimCompleted
                              ? 'bg-[var(--color-accent)] text-white border-2 border-[var(--color-accent)]'
                              : 'bg-[var(--color-paper)] text-[var(--color-ink)]/40 border-2 border-[var(--color-ink)]/10 group-hover:border-[var(--color-ink)]/30'
                        }`}>
                          {isSimCompleted && !isActive ? <CheckCircle2 size={18} /> : phase.id.toString().padStart(2, '0')}
                        </div>
                        
                        <div className="flex-1 pt-3">
                          <h3 className={`text-lg font-semibold tracking-tight transition-colors duration-300 ${
                            isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/60 group-hover:text-[var(--color-ink)]'
                          }`}>
                            {phase.title}
                          </h3>
                        </div>

                        <div className={`pt-3 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                          <ArrowRight size={20} className="text-[var(--color-ink)]/40" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Panel - Details */}
            <div className="w-full lg:w-1/2 lg:h-[calc(100vh-73px)] bg-white flex flex-col relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[var(--color-ink)] blur-[120px]" />
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center border-b border-[var(--color-ink)]/10 px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-0 relative z-20 bg-white/80 backdrop-blur-md">
                <button 
                  onClick={() => setActiveTab('learn')}
                  className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'learn' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70'}`}
                >
                  <BookOpen size={16} /> Learn
                  {activeTab === 'learn' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />}
                </button>
                <button 
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'quiz' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70'}`}
                >
                  <HelpCircle size={16} /> Quiz
                  {activeTab === 'quiz' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />}
                </button>
                <button 
                  onClick={() => setActiveTab('simulate')}
                  className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'simulate' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70'}`}
                >
                  <PlayCircle size={16} /> Simulate
                  {activeTab === 'simulate' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />}
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 xl:p-24 relative z-10">
                <div className="max-w-xl mx-auto lg:mx-0 w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activePhase}-${activeTab}`}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="mb-8">
                        <div className="font-mono text-sm font-bold tracking-widest uppercase text-[var(--color-ink)]/40 mb-4">
                          Phase {currentPhaseData.id.toString().padStart(2, '0')}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] mb-2">
                          {currentPhaseData.title}
                        </h2>
                      </div>

                      {activeTab === 'learn' && (
                        <div className="space-y-6 mt-12">
                          {currentPhaseData.points.map((point, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="flex items-start gap-4 group"
                            >
                              <div className="mt-1 w-6 h-6 rounded-full bg-[var(--color-paper)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-ink)] transition-colors duration-300">
                                <CheckCircle2 size={14} className="text-[var(--color-ink)]/40 group-hover:text-[var(--color-paper)] transition-colors duration-300" />
                              </div>
                              <p className="text-lg text-[var(--color-ink)]/80 leading-relaxed font-medium">
                                {point}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'quiz' && (
                        <div className="space-y-12">
                          {currentPhaseData.quiz.map((q: QuizQuestion, qIndex: number) => {
                            const selectedOptionId = quizAnswers[q.id];
                            const selectedOption = q.options.find(o => o.id === selectedOptionId);

                            return (
                              <div key={q.id} className="space-y-4">
                                <h4 className="text-lg font-semibold leading-snug">
                                  <span className="text-[var(--color-ink)]/40 mr-2">{qIndex + 1}.</span>
                                  {q.question}
                                </h4>
                                <div className="space-y-2">
                                  {q.options.map(opt => {
                                    const isSelected = selectedOptionId === opt.id;
                                    const showCorrect = isSelected && opt.isCorrect;
                                    const showIncorrect = isSelected && !opt.isCorrect;

                                    return (
                                      <button
                                        key={opt.id}
                                        onClick={() => handleQuizAnswer(q.id, opt.id)}
                                        disabled={!!selectedOptionId}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                                          showCorrect ? 'bg-green-50 border-green-200 text-green-900' :
                                          showIncorrect ? 'bg-red-50 border-red-200 text-red-900' :
                                          isSelected ? 'border-[var(--color-ink)] bg-[var(--color-paper)]' :
                                          selectedOptionId ? 'opacity-50 border-transparent bg-[var(--color-paper)]' :
                                          'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30 hover:bg-[var(--color-paper)]'
                                        }`}
                                      >
                                        <div className="flex items-start gap-3">
                                          <div className="mt-0.5">
                                            {showCorrect ? <CheckCircle2 size={18} className="text-green-600" /> :
                                             showIncorrect ? <XCircle size={18} className="text-red-600" /> :
                                             <div className="w-[18px] h-[18px] rounded-full border border-[var(--color-ink)]/20" />}
                                          </div>
                                          <span className="font-medium">{opt.text}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                                
                                <AnimatePresence>
                                  {selectedOption && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${
                                        selectedOption.isCorrect ? 'bg-green-100/50 text-green-800' : 'bg-red-100/50 text-red-800'
                                      }`}
                                    >
                                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                      <p>{selectedOption.feedback}</p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {activeTab === 'simulate' && (
                        <div className="space-y-8">
                          <div className="p-6 rounded-2xl bg-[var(--color-ink)] text-[var(--color-paper)]">
                            <h3 className="text-xl font-bold mb-2">Scenario</h3>
                            <p className="text-[var(--color-paper)]/80 leading-relaxed">
                              {currentPhaseData.simulator.scenario}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-[var(--color-ink)]/40 mb-4">
                              Make a Choice
                            </h4>
                            {currentPhaseData.simulator.choices.map((choice) => {
                              const isSelected = simChoices[currentPhaseData.id] === choice.id;
                              const hasSelection = !!simChoices[currentPhaseData.id];

                              return (
                                <button
                                  key={choice.id}
                                  onClick={() => handleSimChoice(currentPhaseData.id, choice.id)}
                                  disabled={hasSelection}
                                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                                    isSelected && choice.isOptimal ? 'border-green-500 bg-green-50' :
                                    isSelected && !choice.isOptimal ? 'border-orange-500 bg-orange-50' :
                                    hasSelection ? 'opacity-40 border-transparent bg-[var(--color-paper)]' :
                                    'border-[var(--color-ink)]/10 hover:border-[var(--color-ink)] hover:shadow-md'
                                  }`}
                                >
                                  <span className={`font-medium text-lg ${isSelected ? 'text-[var(--color-ink)]' : ''}`}>
                                    {choice.text}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <AnimatePresence>
                            {simChoices[currentPhaseData.id] && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-5 rounded-xl border ${
                                  currentPhaseData.simulator.choices.find(c => c.id === simChoices[currentPhaseData.id])?.isOptimal
                                    ? 'bg-green-50 border-green-200 text-green-900'
                                    : 'bg-orange-50 border-orange-200 text-orange-900'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <BrainCircuit size={20} className="mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h4 className="font-bold mb-1">Feedback</h4>
                                    <p className="font-medium opacity-90">
                                      {currentPhaseData.simulator.choices.find(c => c.id === simChoices[currentPhaseData.id])?.feedback}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Next Phase Prompt */}
                          {simChoices[currentPhaseData.id] && activePhase < 10 && (
                            <motion.div 
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                              className="pt-8 flex justify-end"
                            >
                              <button 
                                onClick={() => {
                                  setActivePhase(activePhase + 1);
                                  setActiveTab('simulate');
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-[var(--color-ink)] text-[var(--color-paper)] rounded-full font-semibold hover:opacity-90 transition-opacity"
                              >
                                Next Phase <ArrowRight size={18} />
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Sandbox />
        )}
      </main>
    </div>
  );
}
