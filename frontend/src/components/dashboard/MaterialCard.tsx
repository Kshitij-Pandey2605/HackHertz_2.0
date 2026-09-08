import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Clock, BookOpen, Layers } from 'lucide-react';
import { Material } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface MaterialCardProps {
  material: Material;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const navigate = useNavigate();

  const isReady = material.status === 'ready';

  const handleContinue = () => {
    if (isReady) {
      navigate(`/workspace/${material.id}`);
    } else {
      navigate(`/processing/${material.id}`);
    }
  };

  const difficultyBadges = {
    EASY: <Badge variant="success" size="sm">Foundational</Badge>,
    MEDIUM: <Badge variant="brand" size="sm">Exam-Oriented</Badge>,
    HARD: <Badge variant="violet" size="sm">Deep Mastery</Badge>,
  };

  return (
    <Card hoverable className="p-4 sm:p-5 flex flex-col justify-between transition-all group">
      <div>
        {/* Header tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded border border-edge">
              {material.fileType}
            </span>
            <span className="text-xs text-ink-secondary font-medium">{material.subject}</span>
          </div>
          {difficultyBadges[material.difficulty]}
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-semibold text-ink group-hover:text-brand-600 transition-colors line-clamp-2 mb-2 leading-snug">
          {material.title}
        </h4>

        {/* Metadata info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-ink-muted mb-4 py-2 border-y border-edge/60">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-ink-subtle" />
            <span>{material.pages} pages</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-ink-subtle" />
            <span>{material.lastStudied}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-ink-subtle" />
            <span>{material.flashcardCount} cards</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-ink-subtle" />
            <span>{material.quizCount} quiz Qs</span>
          </div>
        </div>
      </div>

      {/* Footer & CTA */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`}
          />
          <span className="text-xs font-medium text-ink-secondary">
            {isReady ? 'Ready to study' : 'Processing...'}
          </span>
        </div>
        <Button
          variant={isReady ? 'primary' : 'secondary'}
          size="sm"
          onClick={handleContinue}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Continue
        </Button>
      </div>
    </Card>
  );
};
