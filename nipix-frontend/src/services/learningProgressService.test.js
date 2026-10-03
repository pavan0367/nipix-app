import learningProgressService from './learningProgressService';

describe('learningProgressService — Complete A-to-Z Learning Engine', () => {
  beforeEach(() => {
    localStorage.clear();
    learningProgressService.init('test_scholar_user');
    learningProgressService.resetProgress();
  });

  test('Universal 0% baseline: new scholar genuinely starts at 0 points, 0 streak, 0 completed activities', () => {
    const snapshot = learningProgressService.getStateSnapshot();
    expect(snapshot.earnedPoints).toBe(0);
    expect(snapshot.streak).toBe(0);
    expect(snapshot.completedActivitiesCount).toBe(0);
    expect(snapshot.completedToday).toBe(0);
    expect(Object.keys(snapshot.completedActivities).length).toBe(0);

    // Course progress starts at 0%
    const dsaProgress = learningProgressService.getCourseProgress('cs-dsa', 8);
    expect(dsaProgress).toBe(0);

    // Japanese stats start at 0%
    const jpStats = learningProgressService.getJapaneseStats();
    expect(jpStats.hiragana.count).toBe(0);
    expect(jpStats.hiragana.pct).toBe(0);
    expect(jpStats.katakana.count).toBe(0);
    expect(jpStats.katakana.pct).toBe(0);
    expect(jpStats.kanji.count).toBe(0);
    expect(jpStats.kanji.pct).toBe(0);
    expect(jpStats.overallPct).toBe(0);
  });

  test('Activity completion grants genuine points and records timestamp', () => {
    const result = learningProgressService.recordActivityCompletion(
      'act-intro-dsa',
      'cs-dsa',
      'cs',
      'lesson',
      25,
      { title: 'DSA Intro' }
    );

    expect(result.success).toBe(true);
    expect(result.pointsAwarded).toBe(25);

    const snapshot = learningProgressService.getStateSnapshot();
    expect(snapshot.earnedPoints).toBe(25);
    expect(snapshot.completedActivitiesCount).toBe(1);
    expect(snapshot.completedToday).toBe(1);
    expect(snapshot.streak).toBe(1);
    expect(learningProgressService.isActivityCompleted('act-intro-dsa')).toBe(true);
  });

  test('Anti-inflation: duplicate activity completion awards 0 points', () => {
    learningProgressService.recordActivityCompletion('act-intro-dsa', 'cs-dsa', 'cs', 'lesson', 25);
    const secondTry = learningProgressService.recordActivityCompletion('act-intro-dsa', 'cs-dsa', 'cs', 'lesson', 25);

    expect(secondTry.success).toBe(false);
    expect(secondTry.pointsAwarded).toBe(0);

    const snapshot = learningProgressService.getStateSnapshot();
    expect(snapshot.earnedPoints).toBe(25);
    expect(snapshot.completedActivitiesCount).toBe(1);
  });

  test('Multi-part lessons require all portions completed before full activity completion', () => {
    // Lesson with 3 portions
    const p1 = learningProgressService.completeLessonPortion('lesson-trees', 0, 3, 'cs-dsa', 'cs', 10);
    expect(p1.portionCompleted).toBe(true);
    expect(p1.activityCompleted).toBe(false);
    expect(learningProgressService.isActivityCompleted('lesson-trees')).toBe(false);
    expect(learningProgressService.getLessonPortionProgress('lesson-trees', 3)).toBe(33);

    const p2 = learningProgressService.completeLessonPortion('lesson-trees', 1, 3, 'cs-dsa', 'cs', 10);
    expect(p2.portionCompleted).toBe(true);
    expect(p2.activityCompleted).toBe(false);
    expect(learningProgressService.isActivityCompleted('lesson-trees')).toBe(false);
    expect(learningProgressService.getLessonPortionProgress('lesson-trees', 3)).toBe(67);

    // Final portion
    const p3 = learningProgressService.completeLessonPortion('lesson-trees', 2, 3, 'cs-dsa', 'cs', 10);
    expect(p3.portionCompleted).toBe(true);
    expect(p3.activityCompleted).toBe(true);
    expect(learningProgressService.isActivityCompleted('lesson-trees')).toBe(true);
    expect(learningProgressService.getLessonPortionProgress('lesson-trees', 3)).toBe(100);
  });

  test('Quizzes require passing grade (>= 70%) to complete activity', () => {
    // Failing attempt: 2 out of 5 (40%)
    const failAttempt = learningProgressService.submitQuizOrTest('quiz-1', 'cs-dsa', 'cs', 2, 5, 70, 50);
    expect(failAttempt.passed).toBe(false);
    expect(failAttempt.activityCompleted).toBe(false);
    expect(learningProgressService.isActivityCompleted('quiz-1')).toBe(false);

    // Passing attempt: 4 out of 5 (80%)
    const passAttempt = learningProgressService.submitQuizOrTest('quiz-1', 'cs-dsa', 'cs', 4, 5, 70, 50);
    expect(passAttempt.passed).toBe(true);
    expect(passAttempt.activityCompleted).toBe(true);
    expect(passAttempt.pointsAwarded).toBe(50);
    expect(learningProgressService.isActivityCompleted('quiz-1')).toBe(true);
  });

  test('Japanese Kana & Kanji mastery toggle updates progress stats', () => {
    learningProgressService.toggleMasteredItem('hiragana', 'h-a', 5);
    learningProgressService.toggleMasteredItem('hiragana', 'h-i', 5);
    learningProgressService.toggleMasteredItem('katakana', 'k-a', 5);
    learningProgressService.toggleMasteredItem('kanji', 'kanji-1', 10);

    const stats = learningProgressService.getJapaneseStats();
    expect(stats.hiragana.count).toBe(2);
    expect(stats.katakana.count).toBe(1);
    expect(stats.kanji.count).toBe(1);
    expect(learningProgressService.isItemMastered('hiragana', 'h-a')).toBe(true);
    expect(learningProgressService.isItemMastered('hiragana', 'h-u')).toBe(false);

    // Untoggling reduces count
    learningProgressService.toggleMasteredItem('hiragana', 'h-a', 5);
    expect(learningProgressService.isItemMastered('hiragana', 'h-a')).toBe(false);
    expect(learningProgressService.getJapaneseStats().hiragana.count).toBe(1);
  });
});
