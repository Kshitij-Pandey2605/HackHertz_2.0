const { generateMasteryAnalytics } = require('../services/learningAnalytics.service');

// Default sample benchmark
const defaultSampleTopics = [
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

const getMasteryDashboard = (req, res) => {
  try {
    const data = generateMasteryAnalytics(defaultSampleTopics);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to compute mastery dashboard',
    });
  }
};

const calculateMastery = (req, res) => {
  try {
    const { topics } = req.body;
    const inputTopics = Array.isArray(topics) && topics.length > 0 ? topics : defaultSampleTopics;
    const data = generateMasteryAnalytics(inputTopics);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze topic performance',
    });
  }
};

module.exports = {
  getMasteryDashboard,
  calculateMastery,
};
