import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ProcessingJob } from '../types';
import { ProcessingSteps } from '../components/processing/ProcessingSteps';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export const ProcessingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadJob = async () => {
      if (!id) return;
      try {
        const res = await api.processing.getStatus(id);
        if (isMounted) {
          setJob(res.data);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load processing job.');
          setIsLoading(false);
        }
      }
    };

    loadJob();

    return () => {
      isMounted = false;
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [id]);

  // Progressive step animation
  useEffect(() => {
    if (!job || job.status === 'completed' || !id) return;

    let currentStep = job.currentStepIndex || 0;
    const totalSteps = job.steps.length;

    stepTimerRef.current = setInterval(async () => {
      if (currentStep < totalSteps - 1) {
        currentStep += 1;
        const res = await api.processing.updateJobStep(id, currentStep, false);
        setJob(res.data);
      } else {
        // Complete the last step
        if (stepTimerRef.current) clearInterval(stepTimerRef.current);
        const res = await api.processing.updateJobStep(id, currentStep, true);
        setJob(res.data);
      }
    }, 1400); // 1.4s per step for a realistic and smooth AI generation feedback feel

    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [id, !!job]);

  if (isLoading) {
    return <LoadingState fullPage title="Initializing AI Pipeline..." description="Setting up document parser and summary generators" />;
  }

  if (error || !job) {
    return (
      <ErrorState
        fullPage
        title="Processing Job Not Found"
        message={error || 'Unable to load the requested processing job.'}
        retryLabel="Return to Upload"
        onRetry={() => navigate('/upload')}
      />
    );
  }

  const handleOpenWorkspace = () => {
    navigate(`/workspace/${job.materialId}`);
  };

  return (
    <div className="py-6 animate-fadeIn">
      <div className="text-center max-w-lg mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          {job.status === 'completed' ? 'Workspace Generated' : 'Synthesizing Your Material'}
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          {job.status === 'completed'
            ? 'All summaries, formula sheets, flashcards, and quizzes are ready for study.'
            : 'Applying natural language processing to isolate formulas, summaries, and active recall tests.'}
        </p>
      </div>

      <ProcessingSteps job={job} onOpenWorkspace={handleOpenWorkspace} />
    </div>
  );
};
