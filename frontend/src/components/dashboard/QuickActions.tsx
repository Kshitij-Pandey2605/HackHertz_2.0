import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, BookOpen, Layers, HelpCircle, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface QuickActionsProps {
  latestMaterialId?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ latestMaterialId }) => {
  const navigate = useNavigate();
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    phase: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    phase: '',
  });

  interface ActionItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
    highlight: boolean;
    badge?: string;
  }

  const actions: ActionItem[] = [
    {
      id: 'upload',
      title: 'Upload Material',
      description: 'Transform new lecture slides, notes or textbooks with AI',
      icon: <UploadCloud className="w-5 h-5 text-brand-600" />,
      action: () => navigate('/upload'),
      highlight: true,
    },
    {
      id: 'continue',
      title: 'Continue Studying',
      description: 'Pick up right where you left off on your latest chapter',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      action: () => {
        if (latestMaterialId) {
          navigate(`/workspace/${latestMaterialId}`);
        } else {
          navigate('/upload');
        }
      },
      highlight: false,
    },
    {
      id: 'flashcards',
      title: 'Study Flashcards',
      description: 'Test your active recall with interactive flashcard decks',
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      action: () => {
        navigate(`/workspace/${latestMaterialId || 'mat_dbms_01'}/flashcards`);
      },
      highlight: false,
    },
    {
      id: 'quiz',
      title: 'Take Quiz',
      description: 'Self-assessment quizzes with instant diagnostics & scoring',
      icon: <HelpCircle className="w-5 h-5 text-amber-600" />,
      action: () => {
        navigate(`/workspace/${latestMaterialId || 'mat_dbms_01'}/quiz/setup`);
      },
      highlight: false,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => (
          <Card
            key={act.id}
            hoverable
            onClick={act.action}
            className={`p-4 sm:p-5 flex flex-col justify-between transition-all group ${
              act.highlight
                ? 'bg-gradient-to-br from-brand-50/50 to-white border-brand-200 hover:border-brand-400'
                : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-edge group-hover:scale-105 transition-transform">
                  {act.icon}
                </div>
                {act.badge ? (
                  <span className="text-[10px] font-semibold text-ink-muted bg-gray-100 border border-edge px-2 py-0.5 rounded-md">
                    {act.badge}
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-ink-subtle group-hover:text-brand-600 transition-colors" />
                )}
              </div>
              <h4 className="text-sm font-semibold text-ink group-hover:text-brand-600 transition-colors mb-1">
                {act.title}
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                {act.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Graceful modal for coming soon features */}
      <Modal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo((prev) => ({ ...prev, isOpen: false }))}
        title={modalInfo.title}
        description={modalInfo.phase}
      >
        <div className="py-2 space-y-4">
          <p className="text-sm text-ink-secondary leading-relaxed">
            {modalInfo.description}
          </p>
          <div className="p-3 bg-brand-50/70 rounded-xl border border-brand-200 text-xs text-brand-900">
            <strong>Tip:</strong> All material uploads during Phase 1 already automatically compute flashcard and quiz datasets in the background so your material will be immediately ready.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalInfo((prev) => ({ ...prev, isOpen: false }))}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setModalInfo((prev) => ({ ...prev, isOpen: false }));
                navigate('/upload');
              }}
            >
              Upload New Material
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
