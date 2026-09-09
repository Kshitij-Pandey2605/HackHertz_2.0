import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Sparkles,
  X,
  RotateCcw,
  BookOpen,
  HelpCircle,
  AlertCircle,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react';
import { api } from '../../services/api';
import { CopilotMessage as CopilotMessageType, CopilotContext, CopilotAction } from '../../types';
import { CopilotMessage } from './CopilotMessage';
import { CopilotInput } from './CopilotInput';
import { SuggestedPrompts } from './SuggestedPrompts';

export const StudyCopilot: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  // Extract active study context from route
  const activeMaterialId = id || 'mat_dbms_01';
  const pathname = location.pathname;

  let currentModuleName = 'Study Overview';
  if (pathname.includes('quick-glance')) currentModuleName = 'Quick Glance';
  else if (pathname.includes('deep-summary')) currentModuleName = 'Deep Summary';
  else if (pathname.includes('exam-cram')) currentModuleName = 'Exam Cram';
  else if (pathname.includes('chapters')) currentModuleName = 'Chapters';
  else if (pathname.includes('key-points')) currentModuleName = 'Key Points';
  else if (pathname.includes('formulas')) currentModuleName = 'Formulas & Rules';
  else if (pathname.includes('glossary')) currentModuleName = 'Glossary';
  else if (pathname.includes('flashcards')) currentModuleName = 'Flashcards';
  else if (pathname.includes('quiz/results')) currentModuleName = 'Quiz Results';
  else if (pathname.includes('quiz')) currentModuleName = 'Quiz Assessment';
  else if (pathname.includes('export')) currentModuleName = 'Export Sheet';

  const context: CopilotContext = {
    materialId: activeMaterialId,
    materialTitle: 'Database Management Systems — Normalization',
    moduleName: currentModuleName,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessageType[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdFlashcard, setCreatedFlashcard] = useState<{ q: string; a: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const storageKey = `premind_copilot_chat_${activeMaterialId}`;

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }
  }, [storageKey]);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (err) {
        console.warn('Failed to persist copilot messages to localStorage', err);
      }
    }
  }, [messages, storageKey]);

  // Load contextual suggested prompts whenever the route/module changes
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await api.copilot.getSuggestedPrompts(context);
        if (res.data) setPrompts(res.data);
      } catch (err) {
        console.warn('Failed to load copilot suggested prompts', err);
      }
    };

    fetchPrompts();
  }, [pathname, activeMaterialId]);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    const studentMsg: CopilotMessageType = {
      id: `msg_student_${Date.now()}`,
      sender: 'student',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextModule: currentModuleName,
    };

    setMessages((prev) => [...prev, studentMsg]);
    setIsLoading(true);

    try {
      const res = await api.copilot.sendMessage({
        message: text.trim(),
        context,
        conversationHistory: messages.map((m) => ({ sender: m.sender, content: m.content })),
      });

      if (res.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate explanation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    setCreatedFlashcard(null);
    localStorage.removeItem(storageKey);
  };

  const handleActionClick = (action: CopilotAction) => {
    if (action.actionType === 'quiz_me') {
      setIsOpen(false);
      navigate(action.targetUrl || `/workspace/${activeMaterialId}/quiz/setup`);
    } else if (action.actionType === 'navigate' && action.targetUrl) {
      setIsOpen(false);
      navigate(action.targetUrl);
    } else if (action.actionType === 'explain_simpler') {
      handleSendMessage('Can you explain this simpler with a real-world kitchen or everyday analogy?');
    } else if (action.actionType === 'make_flashcard') {
      // Mock flashcard generation preview
      setCreatedFlashcard({
        q: 'What condition defines Second Normal Form (2NF)?',
        a: '2NF requires 1NF + NO partial dependencies (every non-prime attribute must depend on the whole primary key).',
      });
    }
  };

  return (
    <>
      {/* 1. FLOATING ENTRY BUTTON (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-700 text-white font-bold text-xs shadow-elevated hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 select-none ${
            isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100'
          }`}
          aria-label="Open PreMind Study Copilot"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>✦ Ask PreMind</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      </div>

      {/* 2. COPILOT SIDE DRAWER PANEL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end print:hidden animate-fadeIn">
          {/* Backdrop on mobile */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-ink/20 backdrop-blur-xs transition-opacity sm:hidden"
          />

          {/* Drawer Container */}
          <aside className="relative w-full sm:w-[420px] h-full bg-canvas border-l border-edge shadow-2xl flex flex-col z-10 animate-slideLeft">
            {/* Header */}
            <div className="h-16 px-4 border-b border-edge bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-ink truncate">PreMind Copilot</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
                      Study AI
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-muted truncate">
                    Studying: <span className="font-semibold text-brand-600">{currentModuleName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-gray-100 transition-colors"
                    title="Clear chat history"
                    aria-label="Clear chat history"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-gray-100 transition-colors"
                  title="Close Copilot panel"
                  aria-label="Close Copilot panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Flashcard Created Toast Banner */}
            {createdFlashcard && (
              <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-950 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Flashcard Added to Deck!</span>
                    <span className="text-[11px] text-emerald-800 line-clamp-1">{createdFlashcard.q}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCreatedFlashcard(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold text-xs ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* Empty State */}
              {messages.length === 0 && (
                <div className="py-6 space-y-5 animate-fadeIn">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto shadow-subtle">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-ink">
                      👋 Need help understanding this topic?
                    </h4>
                    <p className="text-xs text-ink-muted max-w-[280px] mx-auto leading-relaxed">
                      Ask me to simplify concepts, explain formulas, give examples, or quiz you on what you&apos;re currently studying.
                    </p>
                  </div>

                  {/* Contextual Clickable Suggestions */}
                  <SuggestedPrompts
                    prompts={prompts}
                    onSelectPrompt={handleSendMessage}
                    isLoading={isLoading}
                  />
                </div>
              )}

              {/* Message History */}
              {messages.map((msg) => (
                <CopilotMessage
                  key={msg.id}
                  message={msg}
                  onActionClick={handleActionClick}
                />
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-brand-700 bg-brand-50 border border-brand-200 p-3 rounded-2xl w-fit animate-fadeIn">
                  <Sparkles className="w-4 h-4 animate-spin text-brand-600" />
                  <span>PreMind is thinking...</span>
                  <span className="flex items-center gap-1 pl-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Something went wrong.</span>
                  </div>
                  <p className="text-[11px] text-rose-800">{error}</p>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Can you explain this simply?')}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area */}
            <CopilotInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder={`Ask about ${currentModuleName}...`}
            />
          </aside>
        </div>
      )}
    </>
  );
};

export default StudyCopilot;
