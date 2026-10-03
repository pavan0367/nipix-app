import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import learningProgressService from '../services/learningProgressService';

export const useLearningProgress = () => {
  const { user } = useSelector((state) => state.auth || {});
  const [snapshot, setSnapshot] = useState(() => learningProgressService.getStateSnapshot());

  // Re-initialize progress storage key if user changes (e.g. login/logout)
  useEffect(() => {
    learningProgressService.init(user?.id || user?.username || null);
    setSnapshot(learningProgressService.getStateSnapshot());
  }, [user?.id, user?.username]);

  // Subscribe to reactive service notifications
  useEffect(() => {
    const unsubscribe = learningProgressService.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);
    });
    return unsubscribe;
  }, []);

  const recordActivityCompletion = useCallback((activityId, courseId, subjectId, type, points, metadata) => {
    return learningProgressService.recordActivityCompletion(activityId, courseId, subjectId, type, points, metadata);
  }, []);

  const completeLessonPortion = useCallback((lessonId, portionIdx, totalPortions, courseId, subjectId, points) => {
    return learningProgressService.completeLessonPortion(lessonId, portionIdx, totalPortions, courseId, subjectId, points);
  }, []);

  const submitQuizOrTest = useCallback((quizId, courseId, subjectId, score, maxScore, passingPercentage, points) => {
    return learningProgressService.submitQuizOrTest(quizId, courseId, subjectId, score, maxScore, passingPercentage, points);
  }, []);

  const completeVideo = useCallback((videoId, courseId, subjectId, points) => {
    return learningProgressService.completeVideo(videoId, courseId, subjectId, points);
  }, []);

  const completeTask = useCallback((taskId, courseId, subjectId, points) => {
    return learningProgressService.completeTask(taskId, courseId, subjectId, points);
  }, []);

  const completeProject = useCallback((projectId, courseId, subjectId, points) => {
    return learningProgressService.completeProject(projectId, courseId, subjectId, points);
  }, []);

  const toggleMasteredItem = useCallback((category, itemId, points) => {
    return learningProgressService.toggleMasteredItem(category, itemId, points);
  }, []);

  const isItemMastered = useCallback((category, itemId) => {
    return learningProgressService.isItemMastered(category, itemId);
  }, []);

  const isActivityCompleted = useCallback((activityId) => {
    return !!snapshot.completedActivities[activityId];
  }, [snapshot.completedActivities]);

  const isLessonPortionCompleted = useCallback((lessonId, portionIdx) => {
    return learningProgressService.isLessonPortionCompleted(lessonId, portionIdx);
  }, [snapshot.lessonPortions]);

  const getLessonPortionProgress = useCallback((lessonId, totalPortions) => {
    return learningProgressService.getLessonPortionProgress(lessonId, totalPortions);
  }, [snapshot.lessonPortions]);

  const getCourseProgress = useCallback((courseId, totalRequiredActivities) => {
    return learningProgressService.getCourseProgress(courseId, totalRequiredActivities);
  }, [snapshot.completedActivities]);

  const getJapaneseStats = useCallback(() => {
    return learningProgressService.getJapaneseStats();
  }, [snapshot.masteredItems, snapshot.completedActivities]);

  const getGlobalProgress = useCallback((totalActivities) => {
    return learningProgressService.getGlobalProgress(totalActivities);
  }, [snapshot.completedActivities]);

  const resetProgress = useCallback(() => {
    learningProgressService.resetProgress();
  }, []);

  return {
    ...snapshot,
    recordActivityCompletion,
    completeLessonPortion,
    submitQuizOrTest,
    completeVideo,
    completeTask,
    completeProject,
    toggleMasteredItem,
    isItemMastered,
    isActivityCompleted,
    isLessonPortionCompleted,
    getLessonPortionProgress,
    getCourseProgress,
    getJapaneseStats,
    getGlobalProgress,
    resetProgress
  };
};

export default useLearningProgress;
