import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptsProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  isLoading?: boolean;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  prompts,
  onSelectPrompt,
  isLoading = false,
}) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-muted uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-brand-600" />
        <span>Suggested Questions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => onSelectPrompt(prompt)}
            className="text-left text-xs font-medium text-ink bg-gray-50 hover:bg-brand-50 hover:text-brand-900 border border-edge hover:border-brand-200 px-3 py-1.5 rounded-xl transition-all shadow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
