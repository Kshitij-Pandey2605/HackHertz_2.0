/**
 * PreMind AI - Learning Analytics Engine
 * Implements Topic Accuracy, Mastery Score, Topic Classification, and Exam Readiness Analysis
 */

/**
 * Rule 1: Calculate Topic Accuracy
 * Accuracy % = (Correct Answers / Total Questions Attempted) × 100
 */
function calculateTopicAccuracy(correctAnswers, questionsAttempted) {
  if (!questionsAttempted || questionsAttempted <= 0) return 0;
  return Math.round((correctAnswers / questionsAttempted) * 100 * 10) / 10;
}

/**
 * Rule 2: Calculate Mastery Score
 * Mastery Score = 70% Quiz Accuracy + 20% Revision Consistency + 10% Study Engagement
 */
function calculateMasteryScore(accuracyPct, revisionCount = 0, studyHours = 0, benchmarkRevisions = 5, benchmarkHours = 8) {
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
function classifyMasteryLevel(mastery) {
  if (mastery >= 90) return 'Expert';
  if (mastery >= 75) return 'Strong';
  if (mastery >= 60) return 'Moderate';
  if (mastery >= 40) return 'Weak';
  return 'Critical';
}

/**
 * Parse study time into numeric hours
 */
function parseStudyHours(studyTime) {
  if (typeof studyTime === 'number') return studyTime;
  if (!studyTime) return 0;
  const str = String(studyTime).toLowerCase().trim();
  if (str.endsWith('h')) return parseFloat(str.replace('h', '')) || 0;
  if (str.endsWith('m') || str.endsWith('min')) return (parseFloat(str.replace(/[^\d.]/g, '')) || 0) / 60;
  return parseFloat(str) || 0;
}

/**
 * Rule 4, 5, 6, 7: Generate Full Topic Analytics and Dashboard
 */
function generateMasteryAnalytics(inputs = []) {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    return {
      overallMastery: 0,
      strongestTopic: 'None',
      weakestTopic: 'None',
      mostImprovedTopic: 'None',
      topicsNeedingRevision: [],
      topics: [],
      recommendations: ['No study activity recorded yet.'],
    };
  }

  const topics = inputs.map((item) => {
    const accuracy = calculateTopicAccuracy(item.correctAnswers || 0, item.questionsAttempted || 0);
    const studyHours = item.studyTimeHours !== undefined ? item.studyTimeHours : parseStudyHours(item.studyTime);
    const mastery = calculateMasteryScore(accuracy, item.revisionCount || 0, studyHours);
    const level = classifyMasteryLevel(mastery);

    return {
      topic: item.topic,
      mastery,
      level,
      questionsAttempted: item.questionsAttempted || 0,
      correctAnswers: item.correctAnswers || 0,
      studyTime: item.studyTime || `${studyHours}h`,
      revisionCount: item.revisionCount || 0,
      examReadinessContribution: 0,
      subject: item.subject || 'General',
    };
  });

  const totalMastery = topics.reduce((sum, t) => sum + t.mastery, 0);
  const overallMastery = Math.round(totalMastery / topics.length);

  // Exam readiness contribution
  topics.forEach((t) => {
    t.examReadinessContribution = totalMastery > 0
      ? Math.round((t.mastery / totalMastery) * 100 * 10) / 10
      : Math.round((100 / topics.length) * 10) / 10;
  });

  const sortedByMastery = [...topics].sort((a, b) => b.mastery - a.mastery);
  const strongestTopic = sortedByMastery[0].topic;
  const weakestTopic = sortedByMastery[sortedByMastery.length - 1].topic;

  // Most improved topic
  let bestDelta = -Infinity;
  let mostImprovedTopic = topics[0].topic;
  inputs.forEach((raw) => {
    const current = topics.find((p) => p.topic === raw.topic);
    if (current && raw.previousMastery !== undefined) {
      const delta = current.mastery - raw.previousMastery;
      if (delta > bestDelta) {
        bestDelta = delta;
        mostImprovedTopic = current.topic;
      }
    }
  });

  if (bestDelta === -Infinity && topics.length > 1) {
    const strongNotMax = sortedByMastery.find((t) => t.level === 'Strong');
    mostImprovedTopic = strongNotMax ? strongNotMax.topic : sortedByMastery[1].topic;
  }

  // Topics needing revision
  const topicsNeedingRevision = topics
    .filter((t) => t.mastery < 75)
    .sort((a, b) => a.mastery - b.mastery)
    .map((t) => t.topic);

  // Recommendations
  const strongList = topics.filter((t) => t.mastery >= 75).map((t) => t.topic);
  const weakList = topics.filter((t) => t.mastery < 75).map((t) => t.topic);

  const recommendations = [];
  if (strongList.length > 0 && weakList.length > 0) {
    recommendations.push(
      `Your ${strongList.join(' and ')} understanding is strong. Focus more on ${weakList.join(' and ')} to improve overall exam readiness.`
    );
  }
  weakList.forEach((weak) => {
    recommendations.push(`Revise ${weak} fundamentals and practice targeted quiz questions.`);
  });
  if (strongList.length > 0) {
    recommendations.push(`Continue maintaining ${strongList[0]} performance with periodic review.`);
  }

  return {
    overallMastery,
    strongestTopic,
    weakestTopic,
    mostImprovedTopic,
    topicsNeedingRevision,
    topics,
    recommendations,
  };
}

module.exports = {
  calculateTopicAccuracy,
  calculateMasteryScore,
  classifyMasteryLevel,
  generateMasteryAnalytics,
};
