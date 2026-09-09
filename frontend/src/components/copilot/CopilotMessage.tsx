import React from 'react';
import { Sparkles, User as UserIcon, ArrowRight, Layers, HelpCircle, BookOpen, RotateCw } from 'lucide-react';
import { CopilotMessage as CopilotMessageType, CopilotAction } from '../../types';

interface CopilotMessageProps {
  message: CopilotMessageType;
  onActionClick?: (action: CopilotAction) => void;
}

export const CopilotMessage: React.FC<CopilotMessageProps> = ({
  message,
  onActionClick,
}) => {
  const isStudent = message.sender === 'student';

  // Helper to render markdown-like structured blocks cleanly
  const renderFormattedContent = (content: string) => {
    // Split by sections or paragraphs
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentBlock: string[] = [];

    const flushBlock = (key: number) => {
      if (currentBlock.length === 0) return null;
      const text = currentBlock.join('\n').trim();
      currentBlock = [];

      if (!text) return null;

      // Check for Callouts
      if (text.startsWith('>')) {
        const quoteText = text.replace(/^>\s*/gm, '');
        return (
          <div
            key={key}
            className="p-3 my-2 rounded-xl bg-purple-50/80 border border-purple-200/80 text-purple-950 text-xs leading-relaxed font-medium"
          >
            {quoteText}
          </div>
        );
      }

      // Check for Header sections
      if (text.startsWith('###')) {
        const headerTitle = text.replace(/^###\s*/, '');
        return (
          <h4
            key={key}
            className="text-xs font-bold text-ink uppercase tracking-wider mt-3 mb-1.5 flex items-center gap-1.5"
          >
            {headerTitle}
          </h4>
        );
      }

      // Bullet lists
      if (text.startsWith('- ') || text.startsWith('* ')) {
        const items = text.split('\n').filter((l) => l.startsWith('- ') || l.startsWith('* '));
        return (
          <ul key={key} className="space-y-1.5 my-2 pl-2 text-xs text-ink-secondary">
            {items.map((item, i) => {
              const cleanItem = item.replace(/^[-*]\s*/, '');
              return (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: cleanItem
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-ink font-semibold">$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-[11px] text-brand-700">$1</code>'),
                    }}
                  />
                </li>
              );
            })}
          </ul>
        );
      }

      // Regular paragraph with bolding and code highlights
      return (
        <p
          key={key}
          className="text-xs text-ink leading-relaxed my-1.5"
          dangerouslySetInnerHTML={{
            __html: text
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-ink font-bold">$1</strong>')
              .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-[11px] text-brand-700">$1</code>'),
          }}
        />
      );
    };

    lines.forEach((line, index) => {
      if (line.trim() === '') {
        const rendered = flushBlock(index);
        if (rendered) elements.push(rendered);
      } else if (line.startsWith('###') || line.startsWith('>')) {
        const prev = flushBlock(index);
        if (prev) elements.push(prev);
        currentBlock.push(line);
        const current = flushBlock(index + 1);
        if (current) elements.push(current);
      } else {
        currentBlock.push(line);
      }
    });

    const last = flushBlock(lines.length);
    if (last) elements.push(last);

    return elements;
  };

  const renderActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'quiz_me':
        return <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'make_flashcard':
        return <Layers className="w-3.5 h-3.5 text-purple-600" />;
      case 'explain_simpler':
        return <RotateCw className="w-3.5 h-3.5 text-amber-600" />;
      case 'navigate':
        return <BookOpen className="w-3.5 h-3.5 text-brand-600" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-brand-600" />;
    }
  };

  if (isStudent) {
    return (
      <div className="flex justify-end gap-2.5 animate-fadeIn">
        <div className="max-w-[85%] space-y-1">
          <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-subtle">
            <p className="text-xs leading-relaxed font-medium">{message.content}</p>
          </div>
          <div className="text-[10px] text-ink-muted text-right px-1">
            {message.timestamp}
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <UserIcon className="w-3.5 h-3.5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2.5 animate-fadeIn">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
        <Sparkles className="w-3.5 h-3.5" />
      </div>

      <div className="max-w-[88%] space-y-2">
        <div className="bg-white border border-edge rounded-2xl rounded-tl-sm p-4 shadow-subtle space-y-2">
          {/* Header metadata */}
          <div className="flex items-center justify-between border-b border-edge/60 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-ink">PreMind Copilot</span>
              <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 border border-brand-200 px-1.5 py-0.2 rounded">
                AI Study Assistant
              </span>
            </div>
            <span className="text-[10px] text-ink-muted">{message.timestamp}</span>
          </div>

          {/* Formatted Message Body */}
          <div className="space-y-1 pt-1">{renderFormattedContent(message.content)}</div>

          {/* Follow-up Contextual Action Buttons */}
          {message.actions && message.actions.length > 0 && (
            <div className="pt-3 border-t border-edge/60 space-y-1.5">
              <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
                Suggested Next Actions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.actions.map((action, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onActionClick && onActionClick(action)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-brand-50 hover:text-brand-900 border border-edge hover:border-brand-200 transition-colors shadow-subtle"
                  >
                    {renderActionIcon(action.actionType)}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopilotMessage;
