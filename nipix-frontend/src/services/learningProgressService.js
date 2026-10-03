// Nipix Learning Progress Service
// Implements real completion-based tracking, zero fake progress, persistence, and reactive updates.

const STORAGE_PREFIX = 'nipix_learning_progress_';

const getStorageKey = (userId) => {
  return `${STORAGE_PREFIX}${userId || 'guest'}`;
};

const getTodayDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate genuine consecutive daily streak based on real activity timestamps
const calculateStreak = (dailyLog) => {
  if (!dailyLog || Object.keys(dailyLog).length === 0) return 0;
  
  const today = getTodayDateStr();
  const dates = Object.keys(dailyLog).filter(k => dailyLog[k] > 0).sort().reverse();
  if (dates.length === 0) return 0;

  // If user has not completed anything today or yesterday, streak is broken
  const todayDate = new Date(today);
  const mostRecent = new Date(dates[0]);
  const diffDays = Math.round((todayDate - mostRecent) / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) return 0;

  let streak = 0;
  let checkDate = new Date(dates[0]);
  
  for (const dStr of dates) {
    const curDate = new Date(dStr);
    const dayGap = Math.round((checkDate - curDate) / (1000 * 60 * 60 * 24));
    if (dayGap <= 1) {
      streak += 1;
      checkDate = curDate;
    } else {
      break;
    }
  }

  return streak;
};

const DEFAULT_STATE = {
  completedActivities: {}, // { [id]: { completedAt, score, points, type, courseId, subjectId } }
  lessonPortions: {},      // { [lessonId]: { [portionIdx]: true } }
  masteredItems: {
    hiragana: {},          // { [char]: true }
    katakana: {},          // { [char]: true }
    kanji: {},             // { [char]: true }
    vocab: {},             // { [term]: true }
    grammar: {}            // { [pattern]: true }
  },
  earnedPoints: 0,
  dailyActivityLog: {},    // { 'YYYY-MM-DD': count }
  lastActiveDate: null
};

class LearningProgressService {
  constructor() {
    this.currentUserId = null;
    this.listeners = new Set();
    this.state = { ...DEFAULT_STATE };
    this.init();
  }

  init(userId = null) {
    this.currentUserId = userId;
    const key = getStorageKey(userId);
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = {
          completedActivities: parsed.completedActivities || {},
          lessonPortions: parsed.lessonPortions || {},
          masteredItems: {
            hiragana: parsed.masteredItems?.hiragana || {},
            katakana: parsed.masteredItems?.katakana || {},
            kanji: parsed.masteredItems?.kanji || {},
            vocab: parsed.masteredItems?.vocab || {},
            grammar: parsed.masteredItems?.grammar || {}
          },
          earnedPoints: Number(parsed.earnedPoints) || 0,
          dailyActivityLog: parsed.dailyActivityLog || {},
          lastActiveDate: parsed.lastActiveDate || null
        };
      } else {
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
    } catch (e) {
      console.warn('Failed to parse learning progress from localStorage, initializing fresh 0% state:', e);
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    this.notify();
  }

  save() {
    const key = getStorageKey(this.currentUserId);
    try {
      localStorage.setItem(key, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save learning progress to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.getStateSnapshot());
      } catch (err) {
        console.error('LearningProgress listener error:', err);
      }
    });
  }

  getStateSnapshot() {
    const today = getTodayDateStr();
    const streak = calculateStreak(this.state.dailyActivityLog);
    const completedList = Object.values(this.state.completedActivities);

    const completedLessons = completedList.filter(a => a.type === 'lesson').length;
    const completedTasks = completedList.filter(a => a.type === 'task').length;
    const completedTests = completedList.filter(a => a.type === 'test' || a.type === 'quiz').length;
    const completedVideos = completedList.filter(a => a.type === 'video').length;
    const completedProjects = completedList.filter(a => a.type === 'project').length;
    const completedToday = this.state.dailyActivityLog[today] || 0;

    return {
      completedActivities: { ...this.state.completedActivities },
      lessonPortions: { ...this.state.lessonPortions },
      masteredItems: { ...this.state.masteredItems },
      earnedPoints: this.state.earnedPoints,
      streak,
      completedLessons,
      completedTasks,
      completedTests,
      completedVideos,
      completedProjects,
      completedToday,
      completedActivitiesCount: completedList.length,
      totalCompletedActivities: completedList.length
    };
  }

  recordActivityCompletion(activityId, courseId, subjectId, type, points = 10, metadata = {}) {
    if (!activityId) return { success: false, isNew: false, pointsAwarded: 0 };
    
    const existing = this.state.completedActivities[activityId];
    const isFirstTime = !existing || existing.type === 'test_attempt';
    const today = getTodayDateStr();

    if (isFirstTime) {
      this.state.completedActivities[activityId] = {
        completedAt: new Date().toISOString(),
        points,
        type,
        courseId,
        subjectId,
        ...metadata
      };
      this.state.earnedPoints += points;
      this.state.dailyActivityLog[today] = (this.state.dailyActivityLog[today] || 0) + 1;
      this.state.lastActiveDate = today;
      this.save();
      return { success: true, isNew: true, pointsAwarded: points };
    } else {
      // Repeat attempt: update metadata or score if applicable, but guard against duplicate points
      this.state.completedActivities[activityId] = {
        ...this.state.completedActivities[activityId],
        lastAttemptAt: new Date().toISOString(),
        ...metadata
      };
      this.save();
      return { success: false, isNew: false, pointsAwarded: 0 };
    }
  }

  // Multi-part lesson portion completion: requires ALL parts to be completed to count as a completed lesson
  completeLessonPortion(lessonId, portionIdx, totalPortions, courseId, subjectId, lessonPoints = 25) {
    if (!lessonId || portionIdx === undefined || !totalPortions) {
      return { portionCompleted: false, isLessonCompleted: false, activityCompleted: false, completedCount: 0, totalPortions };
    }

    if (!this.state.lessonPortions[lessonId]) {
      this.state.lessonPortions[lessonId] = {};
    }

    this.state.lessonPortions[lessonId][portionIdx] = true;

    // Check if all portions are now completed
    const completedCount = Object.keys(this.state.lessonPortions[lessonId]).length;
    if (completedCount >= totalPortions) {
      // Lesson fully completed!
      const res = this.recordActivityCompletion(lessonId, courseId, subjectId, 'lesson', lessonPoints, {
        portionsCompleted: completedCount,
        totalPortions
      });
      return {
        portionCompleted: true,
        isLessonCompleted: true,
        activityCompleted: true,
        isNew: res.isNew,
        pointsAwarded: res.pointsAwarded,
        completedCount,
        totalPortions
      };
    }

    this.save();
    return {
      portionCompleted: true,
      isLessonCompleted: false,
      activityCompleted: false,
      isNew: false,
      pointsAwarded: 0,
      completedCount,
      totalPortions
    };
  }

  isActivityCompleted(activityId) {
    const act = this.state.completedActivities[activityId];
    return !!(act && act.type !== 'test_attempt');
  }

  isLessonPortionCompleted(lessonId, portionIdx) {
    return !!(this.state.lessonPortions[lessonId]?.[portionIdx]);
  }

  getLessonPortionProgress(lessonId, totalPortions) {
    const completed = Object.keys(this.state.lessonPortions[lessonId] || {}).length;
    return totalPortions ? Math.round((completed / totalPortions) * 100) : 0;
  }

  // Quiz / Test submission: requires reaching passing score (e.g. 70%) to be recorded as completed
  submitQuizOrTest(quizId, courseId, subjectId, score, maxScore, passingPercentage = 60, testPoints = 50) {
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= passingPercentage;

    if (passed) {
      const res = this.recordActivityCompletion(quizId, courseId, subjectId, 'test', testPoints, {
        score,
        maxScore,
        percentage,
        passed: true
      });
      return {
        passed: true,
        activityCompleted: true,
        percentage,
        isNew: res.isNew,
        pointsAwarded: res.pointsAwarded
      };
    }

    // Did not pass: log attempt but do not count as completed activity
    if (!this.state.completedActivities[quizId]) {
      this.state.completedActivities[quizId] = {
        lastAttemptAt: new Date().toISOString(),
        score,
        maxScore,
        percentage,
        type: 'test_attempt',
        courseId,
        subjectId,
        passed: false
      };
      this.save();
    }
    return {
      passed: false,
      activityCompleted: false,
      percentage,
      isNew: false,
      pointsAwarded: 0
    };
  }

  // Video completion: verified watch/interaction
  completeVideo(videoId, courseId, subjectId, videoPoints = 15) {
    return this.recordActivityCompletion(videoId, courseId, subjectId, 'video', videoPoints);
  }

  // Practical Task completion
  completeTask(taskId, courseId, subjectId, taskPoints = 20) {
    return this.recordActivityCompletion(taskId, courseId, subjectId, 'task', taskPoints);
  }

  // Project completion
  completeProject(projectId, courseId, subjectId, projectPoints = 100) {
    return this.recordActivityCompletion(projectId, courseId, subjectId, 'project', projectPoints);
  }

  // Interactive mastery toggles (Hiragana, Katakana, Kanji, Vocabulary, Grammar)
  toggleMasteredItem(category, itemId, points = 2) {
    if (!this.state.masteredItems[category]) {
      this.state.masteredItems[category] = {};
    }

    const current = !!this.state.masteredItems[category][itemId];
    const today = getTodayDateStr();

    if (!current) {
      this.state.masteredItems[category][itemId] = true;
      this.state.earnedPoints += points;
      this.state.dailyActivityLog[today] = (this.state.dailyActivityLog[today] || 0) + 1;
      this.state.lastActiveDate = today;
      // Also register as an activity
      const activityId = `mastery_${category}_${itemId}`;
      this.state.completedActivities[activityId] = {
        completedAt: new Date().toISOString(),
        points,
        type: 'mastery',
        courseId: 'japanese',
        subjectId: 'languages'
      };
      this.save();
      return true;
    } else {
      // Toggle off / reset mastery if user wants to re-practice
      delete this.state.masteredItems[category][itemId];
      this.state.earnedPoints = Math.max(0, this.state.earnedPoints - points);
      delete this.state.completedActivities[`mastery_${category}_${itemId}`];
      this.save();
      return false;
    }
  }

  isItemMastered(category, itemId) {
    return !!(this.state.masteredItems[category]?.[itemId]);
  }

  // Calculate course completion progress based on required activities
  getCourseProgress(courseId, totalRequiredActivities) {
    if (!totalRequiredActivities || totalRequiredActivities <= 0) return 0;
    const completedForCourse = Object.values(this.state.completedActivities).filter(
      a => a.courseId === courseId && a.type !== 'test_attempt'
    ).length;

    return Math.min(100, Math.round((completedForCourse / totalRequiredActivities) * 100));
  }

  // Get Japanese Language Mastery Breakdown
  getJapaneseStats() {
    const hiraganaCount = Object.keys(this.state.masteredItems.hiragana || {}).length;
    const katakanaCount = Object.keys(this.state.masteredItems.katakana || {}).length;
    const kanjiCount = Object.keys(this.state.masteredItems.kanji || {}).length;
    const vocabCount = Object.keys(this.state.masteredItems.vocab || {}).length;
    const grammarCount = Object.keys(this.state.masteredItems.grammar || {}).length;

    const completedJapaneseActs = Object.values(this.state.completedActivities).filter(
      a => a.courseId === 'japanese' && a.type !== 'test_attempt'
    );

    const readingCompleted = completedJapaneseActs.filter(a => a.type === 'reading' || a.id?.startsWith('reading_')).length;
    const listeningCompleted = completedJapaneseActs.filter(a => a.type === 'listening' || a.id?.startsWith('listening_')).length;
    const jlptCompleted = completedJapaneseActs.filter(a => a.type === 'jlpt' || a.id?.startsWith('jlpt_')).length;

    // Totals for Japanese curriculum
    const TOTAL_HIRAGANA = 46;
    const TOTAL_KATAKANA = 46;
    const TOTAL_KANJI = 103;     // N5 core kanji
    const TOTAL_VOCAB = 800;     // N5 vocabulary targets
    const TOTAL_GRAMMAR = 50;    // N5 core patterns
    const TOTAL_READING = 12;
    const TOTAL_LISTENING = 10;
    const TOTAL_JLPT_MOCKS = 5;

    const hiraganaPct = Math.min(100, Math.round((hiraganaCount / TOTAL_HIRAGANA) * 100));
    const katakanaPct = Math.min(100, Math.round((katakanaCount / TOTAL_KATAKANA) * 100));
    const kanjiPct = Math.min(100, Math.round((kanjiCount / TOTAL_KANJI) * 100));
    const vocabPct = Math.min(100, Math.round((vocabCount / TOTAL_VOCAB) * 100));
    const grammarPct = Math.min(100, Math.round((grammarCount / TOTAL_GRAMMAR) * 100));
    const readingPct = Math.min(100, Math.round((readingCompleted / TOTAL_READING) * 100));
    const listeningPct = Math.min(100, Math.round((listeningCompleted / TOTAL_LISTENING) * 100));
    const jlptPct = Math.min(100, Math.round((jlptCompleted / TOTAL_JLPT_MOCKS) * 100));

    // Weighted Overall Japanese Progress
    const overallWeight = (
      (hiraganaPct * 0.15) +
      (katakanaPct * 0.15) +
      (kanjiPct * 0.20) +
      (vocabPct * 0.20) +
      (grammarPct * 0.15) +
      (readingPct * 0.05) +
      (listeningPct * 0.05) +
      (jlptPct * 0.05)
    );
    const overallPct = Math.min(100, Math.round(overallWeight));

    return {
      overallPct,
      hiragana: { count: hiraganaCount, total: TOTAL_HIRAGANA, pct: hiraganaPct },
      katakana: { count: katakanaCount, total: TOTAL_KATAKANA, pct: katakanaPct },
      kanji: { count: kanjiCount, total: TOTAL_KANJI, pct: kanjiPct },
      vocab: { count: vocabCount, total: TOTAL_VOCAB, pct: vocabPct },
      grammar: { count: grammarCount, total: TOTAL_GRAMMAR, pct: grammarPct },
      reading: { count: readingCompleted, total: TOTAL_READING, pct: readingPct },
      listening: { count: listeningCompleted, total: TOTAL_LISTENING, pct: listeningPct },
      jlpt: { count: jlptCompleted, total: TOTAL_JLPT_MOCKS, pct: jlptPct }
    };
  }

  // Overall Global Platform Learning Progress (Starts at genuine 0%)
  getGlobalProgress(totalAvailablePlatformActivities = 120) {
    const validCompletions = Object.values(this.state.completedActivities).filter(
      a => a.type !== 'test_attempt'
    ).length;

    if (!validCompletions || validCompletions === 0) return 0;
    return Math.min(100, Math.round((validCompletions / totalAvailablePlatformActivities) * 100));
  }

  // Reset all progress to genuine 0% (useful for testing and reset requests)
  resetProgress() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }
}

const learningProgressService = new LearningProgressService();

export default learningProgressService;
