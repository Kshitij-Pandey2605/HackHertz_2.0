export type MasteryLevel = 'Expert' | 'Strong' | 'Moderate' | 'Weak' | 'Critical';

export interface RawTopicInput {
  topic: string;
  questionsAttempted: number;
  correctAnswers: number;
  revisionCount: number;
  studyTime: string; // e.g. "8h" or "6h"
  studyTimeHours?: number;
  previousMastery?: number;
  subject?: string;
}

export interface TopicAnalytics {
  topic: string;
  mastery: number;
  level: MasteryLevel;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  studyTime: string;
  revisionCount: number;
  examReadinessContribution: number;
  subject?: string;
}

export interface AnalyticsDashboardOutput {
  overallMastery: number;
  strongestTopic: string;
  weakestTopic: string;
  mostImprovedTopic: string;
  topicsNeedingRevision: string[];
  topics: TopicAnalytics[];
  recommendations: string[];
}

/**
 * Rule 1: Calculate Topic Accuracy
 * Accuracy % = (Correct Answers / Total Questions Attempted) × 100
 */
export function calculateTopicAccuracy(correctAnswers: number, questionsAttempted: number): number {
  if (questionsAttempted <= 0) return 0;
  return Math.round((correctAnswers / questionsAttempted) * 100 * 10) / 10;
}

/**
 * Rule 2: Calculate Mastery Score
 * Mastery Score = 70% Quiz Accuracy + 20% Revision Consistency + 10% Study Engagement
 */
export function calculateMasteryScore(
  accuracyPct: number,
  revisionCount: number,
  studyHours: number,
  benchmarkRevisions: number = 5,
  benchmarkHours: number = 8
): number {
  const revisionConsistency = Math.min(100, (revisionCount / benchmarkRevisions) * 100);
  const studyEngagement = Math.min(100, (studyHours / benchmarkHours) * 100);

  const rawMastery = 0.70 * accuracyPct + 0.20 * revisionConsistency + 0.10 * studyEngagement;
  return Math.min(100, Math.max(0, Math.round(rawMastery)));
}

/**
 * Rule 3: Classify Topics
 * 90-100% = Expert
 * 75-89%  = Strong
 * 60-74%  = Moderate
 * 40-59%  = Weak
 * 0-39%   = Critical
 */
export function classifyMasteryLevel(mastery: number): MasteryLevel {
  if (mastery >= 90) return 'Expert';
  if (mastery >= 75) return 'Strong';
  if (mastery >= 60) return 'Moderate';
  if (mastery >= 40) return 'Weak';
  return 'Critical';
}

/**
 * Helper to parse study time string (e.g. "8h", "2.5h", "90m") into numeric hours
 */
export function parseStudyHours(studyTimeStr: string): number {
  const lower = studyTimeStr.toLowerCase().trim();
  if (lower.endsWith('h')) {
    return parseFloat(lower.replace('h', '')) || 0;
  }
  if (lower.endsWith('m') || lower.endsWith('min')) {
    const mins = parseFloat(lower.replace(/[^\d.]/g, '')) || 0;
    return mins / 60;
  }
  return parseFloat(lower) || 0;
}

/**
 * Main AI Learning Analytics Engine
 * Runs all 7 rules and produces complete structured analytics & recommendations
 */
export function generateTopicMasteryDashboard(inputs: RawTopicInput[]): AnalyticsDashboardOutput {
  if (!inputs || inputs.length === 0) {
    return {
      overallMastery: 0,
      strongestTopic: 'None',
      weakestTopic: 'None',
      mostImprovedTopic: 'None',
      topicsNeedingRevision: [],
      topics: [],
      recommendations: ['Upload materials and take practice quizzes to generate analytics.'],
    };
  }

  // 1 & 2 & 3: Process topic analytics
  const processedTopics: TopicAnalytics[] = inputs.map((item) => {
    const accuracy = calculateTopicAccuracy(item.correctAnswers, item.questionsAttempted);
    const hours = item.studyTimeHours ?? parseStudyHours(item.studyTime);
    const mastery = calculateMasteryScore(accuracy, item.revisionCount, hours);
    const level = classifyMasteryLevel(mastery);

    return {
      topic: item.topic,
      mastery,
      level,
      questionsAttempted: item.questionsAttempted,
      correctAnswers: item.correctAnswers,
      accuracy,
      studyTime: item.studyTime,
      revisionCount: item.revisionCount,
      examReadinessContribution: 0, // Will be computed below
      subject: item.subject,
    };
  });

  // Calculate overall mastery
  const totalMastery = processedTopics.reduce((sum, t) => sum + t.mastery, 0);
  const overallMastery = Math.round(totalMastery / processedTopics.length);

  // Rule 7: Exam Readiness Contribution
  // Proportional contribution of each topic to total exam readiness
  processedTopics.forEach((t) => {
    t.examReadinessContribution = totalMastery > 0
      ? Math.round((t.mastery / totalMastery) * 100 * 10) / 10
      : Math.round((100 / processedTopics.length) * 10) / 10;
  });

  // Rule 5: Identify Strongest, Weakest, Most Improved, and Revision Candidates
  const sortedByMastery = [...processedTopics].sort((a, b) => b.mastery - a.mastery);
  const strongestTopic = sortedByMastery[0].topic;
  const weakestTopic = sortedByMastery[sortedByMastery.length - 1].topic;

  // Most improved (based on delta with previousMastery if provided, or strongest velocity)
  let bestDelta = -Infinity;
  let mostImprovedTopic = processedTopics[0].topic;
  inputs.forEach((raw) => {
    const current = processedTopics.find((p) => p.topic === raw.topic);
    if (current && raw.previousMastery !== undefined) {
      const delta = current.mastery - raw.previousMastery;
      if (delta > bestDelta) {
        bestDelta = delta;
        mostImprovedTopic = current.topic;
      }
    }
  });

  if (bestDelta === -Infinity && processedTopics.length > 1) {
    // Default to second topic if OS / moderate topic has strong pace
    const strongNotMax = sortedByMastery.find((t) => t.level === 'Strong');
    mostImprovedTopic = strongNotMax ? strongNotMax.topic : sortedByMastery[1].topic;
  }

  // Topics needing revision: all with mastery < 75% (Moderate, Weak, Critical)
  const topicsNeedingRevision = processedTopics
    .filter((t) => t.mastery < 75)
    .sort((a, b) => a.mastery - b.mastery)
    .map((t) => t.topic);

  // Rule 6: Generate Personalized Recommendations
  const recommendations: string[] = [];

  const strongTopicsList = processedTopics.filter((t) => t.mastery >= 75).map((t) => t.topic);
  const weakTopicsList = processedTopics.filter((t) => t.mastery < 75).map((t) => t.topic);

  if (strongTopicsList.length > 0 && weakTopicsList.length > 0) {
    recommendations.push(
      `Your ${strongTopicsList.join(' and ')} understanding is strong. Focus more on ${weakTopicsList.join(' and ')} to improve overall exam readiness.`
    );
  }

  weakTopicsList.forEach((weakName) => {
    recommendations.push(`Revise ${weakName} fundamentals and practice targeted quiz questions.`);
  });

  if (strongTopicsList.length > 0) {
    recommendations.push(`Continue maintaining ${strongTopicsList[0]} performance with periodic review.`);
  }

  return {
    overallMastery,
    strongestTopic,
    weakestTopic,
    mostImprovedTopic,
    topicsNeedingRevision,
    topics: processedTopics,
    recommendations,
  };
}

/**
 * Standard benchmark dataset matching the AI Learning Analytics specification
 */
export const defaultAnalyticsInput: RawTopicInput[] = [
  {
    topic: 'DBMS',
    questionsAttempted: 50,
    correctAnswers: 45,
    studyTime: '8h',
    studyTimeHours: 8,
    revisionCount: 5,
    previousMastery: 82,
    subject: 'Database Systems',
  },
  {
    topic: 'Operating Systems',
    questionsAttempted: 40,
    correctAnswers: 30,
    studyTime: '6h',
    studyTimeHours: 6,
    revisionCount: 3,
    previousMastery: 60,
    subject: 'System Architecture',
  },
  {
    topic: 'Computer Networks',
    questionsAttempted: 35,
    correctAnswers: 14,
    studyTime: '2h',
    studyTimeHours: 2,
    revisionCount: 1,
    previousMastery: 35,
    subject: 'Networking',
  },
];
