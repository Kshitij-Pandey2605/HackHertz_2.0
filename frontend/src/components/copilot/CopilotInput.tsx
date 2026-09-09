import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface CopilotInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const CopilotInput: React.FC<CopilotInputProps> = ({
  onSendMessage,
  isLoading,
  placeholder = 'Ask a question about this study material...',
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative p-3 bg-white border-t border-edge">
      <div className="relative flex items-end gap-2 bg-gray-50 border border-edge rounded-2xl p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          disabled={isLoading}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent resize-none outline-none text-xs text-ink placeholder:text-ink-muted leading-relaxed px-2 py-1 max-h-28 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          aria-label="Send question to Copilot"
          className="p-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-sm"
        >
          {isLoading ? (
            <Sparkles className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-[10px] text-ink-muted px-2 pt-1.5">
        <span>Press <kbd className="font-mono bg-gray-100 px-1 py-0.2 rounded border border-edge">Enter</kbd> to send, <kbd className="font-mono bg-gray-100 px-1 py-0.2 rounded border border-edge">Shift+Enter</kbd> for new line</span>
        <span>Context-Aware</span>
      </div>
    </form>
  );
};

export default CopilotInput;
