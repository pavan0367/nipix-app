import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BookOpen,
  CheckCircle2,
  Play,
  FileCode,
  Award,
  Sparkles,
  HelpCircle,
  X,
  ChevronRight,
  Layers,
  ArrowRight,
  RotateCcw,
  Check,
  Video,
  ExternalLink,
  Lock
} from 'lucide-react';
import useLearningProgress from '../../hooks/useLearningProgress';
import { getCourseActivityCount } from '../../data/courses/coursesData';
import LoginRequiredModal from '../LoginRequiredModal';

const STAGES = [
  { id: 'intro', label: '1. Introduction', icon: BookOpen },
  { id: 'fundamentals', label: '2. Fundamentals', icon: Layers },
  { id: 'lessons', label: '3. Lessons', icon: BookOpen },
  { id: 'practice', label: '4. Practice', icon: HelpCircle },
  { id: 'videos', label: '5. Videos', icon: Video },
  { id: 'tasks', label: '6. Tasks', icon: FileCode },
  { id: 'tests', label: '7. Tests', icon: Award },
  { id: 'project', label: '8. Project', icon: Sparkles }
];

const CourseViewer = ({ course, onClose, initialStage = 'intro' }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(user);

  const {
    completedActivities,
    isActivityCompleted,
    isLessonPortionCompleted,
    getLessonPortionProgress,
    completeLessonPortion,
    completeVideo,
    completeTask,
    submitQuizOrTest,
    completeProject,
    getCourseProgress
  } = useLearningProgress();

  const [activeStage, setActiveStage] = useState(initialStage || 'intro');
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [taskInputs, setTaskInputs] = useState({});
  const [testAnswers, setTestAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [loginModalConfig, setLoginModalConfig] = useState(null);

  if (!course) return null;

  const totalActivities = getCourseActivityCount(course);
  const progressPercent = getCourseProgress(course.id, totalActivities);

  // Gated stage selection: Stages 1 & 2 are public previews; 3 through 8 require authentication
  const handleStageSelect = (stageId) => {
    if (stageId !== 'intro' && stageId !== 'fundamentals' && !isAuthenticated) {
      setLoginModalConfig({
        title: `Sign In to Access ${course.title} Lessons`,
        description: 'Interactive lessons, practice questions, curated video lectures, tasks, and graded tests require an authenticated scholar account.',
        returnUrl: `/study?course=${course.id}&stage=${stageId}`
      });
      return;
    }
    setActiveStage(stageId);
  };

  // Lesson portion helpers
  const activeLesson = course.lessons?.[activeLessonIdx] || course.lessons?.[0];
  const lessonPortionProgress = activeLesson ? getLessonPortionProgress(activeLesson.id, activeLesson.portions?.length) : null;
  const isCurrentLessonComplete = activeLesson ? isActivityCompleted(activeLesson.id) : false;

  const handleCompletePortion = (portionIdx) => {
    if (!isAuthenticated) {
      setLoginModalConfig({
        title: 'Sign In to Complete Lesson',
        description: 'Please sign in or create an account to record your portion progress and earn completion points.',
        returnUrl: `/study?course=${course.id}&stage=lessons`
      });
      return;
    }
    if (!activeLesson) return;
    completeLessonPortion(
      activeLesson.id,
      portionIdx,
      activeLesson.portions.length,
      course.id,
      course.subject,
      activeLesson.points
    );
  };

  const handleCompleteVideo = (video) => {
    if (!isAuthenticated) {
      setLoginModalConfig({
        title: 'Sign In to Complete Video',
        description: 'Please sign in or create an account to record your video milestone and earn points.',
        returnUrl: `/study?course=${course.id}&stage=videos`
      });
      return;
    }
    completeVideo(video.id, course.id, course.subject, video.points);
  };

  const handleCompleteTask = (task) => {
    if (!isAuthenticated) {
      setLoginModalConfig({
        title: 'Sign In to Submit Task',
        description: 'Please sign in or create an account to submit your solution and record your task score.',
        returnUrl: `/study?course=${course.id}&stage=tasks`
      });
      return;
    }
    completeTask(task.id, course.id, course.subject, task.points);
  };

  const handleSubmitTest = (test) => {
    if (!isAuthenticated) {
      setLoginModalConfig({
        title: 'Sign In to Submit Test',
        description: 'Please sign in or create an account to record your test score and earn graded points.',
        returnUrl: `/study?course=${course.id}&stage=tests`
      });
      return;
    }
    let score = 0;
    test.questions.forEach((q, qIdx) => {
      if (testAnswers[qIdx] === q.correctIndex) {
        score += 1;
      }
    });

    const res = submitQuizOrTest(
      test.id,
      course.id,
      course.subject,
      score,
      test.questions.length,
      test.passingScore || 70,
      test.points
    );
    setTestResult(res);
  };

  const handleCompleteProject = (proj) => {
    if (!isAuthenticated) {
      setLoginModalConfig({
        title: 'Sign In to Submit Capstone Project',
        description: 'Please sign in or create an account to verify your capstone milestone and earn completion points.',
        returnUrl: `/study?course=${course.id}&stage=project`
      });
      return;
    }
    completeProject(proj.id, course.id, course.subject, proj.points);
  };

  const handleConsultBot = () => {
    navigate(`/chat/${course.recommendedBot || 'bytebot'}`);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 15, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '1080px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                {course.subject}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>• {course.level}</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {course.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Live Course Progress Bar */}
            <div style={{ width: '180px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-dim)' }}>Course Progress</span>
                <span style={{ color: progressPercent > 0 ? '#10b981' : 'var(--text-dim)' }}>{progressPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: progressPercent > 0 ? 'linear-gradient(90deg, #10b981, #06b6d4)' : 'transparent',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* AI Assistant Quick Trigger */}
            <button
              type="button"
              onClick={handleConsultBot}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
              title={`Ask @${course.recommendedBot} for study guidance`}
            >
              <Sparkles size={14} color="var(--accent-cyan)" />
              <span>Ask AI Tutor</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '8px', borderRadius: '50%' }}
              title="Close Course Viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 8-Stage Horizontal Pipeline Navigation */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(255, 255, 255, 0.01)',
          overflowX: 'auto',
          flexShrink: 0
        }}>
          {STAGES.map((stg) => {
            const Icon = stg.icon;
            const isActive = activeStage === stg.id;
            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => handleStageSelect(stg.id)}
                className={`category-pill ${isActive ? 'active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '6px 14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon size={13} />
                <span>{stg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stage Content Workspace */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* STAGE 1: INTRODUCTION */}
          {activeStage === 'intro' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-blue)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>
                  Course Syllabus & Learning Path
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 18px 0' }}>
                  {course.introduction?.overview || course.shortDescription}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--accent-amber)', margin: '0 0 8px 0' }}>
                      Course Prerequisites:
                    </h4>
                    <ul style={{ paddingLeft: '18px', margin: 0 }}>
                      {course.introduction?.prerequisites?.map((pre, idx) => (
                        <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                          {pre}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--accent-emerald)', margin: '0 0 8px 0' }}>
                      Learning Objectives:
                    </h4>
                    <ul style={{ paddingLeft: '18px', margin: 0 }}>
                      {course.introduction?.learningObjectives?.map((obj, idx) => (
                        <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => handleStageSelect('fundamentals')}
                    className="btn-primary"
                    style={{ padding: '8px 20px', fontSize: '0.84rem', gap: '6px' }}
                  >
                    <span>Proceed to Fundamentals</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: FUNDAMENTALS */}
          {activeStage === 'fundamentals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                Core Conceptual Fundamentals & Terminology
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                Essential principles you must understand before diving into the detailed lesson portions.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '10px' }}>
                {course.fundamentals?.map((fund, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '20px', borderLeft: '3px solid var(--accent-cyan)' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: '0 0 6px 0' }}>
                      {fund.term}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                      {fund.definition}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => handleStageSelect('lessons')}
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.84rem', gap: '6px' }}
                >
                  <span>Start Lessons</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: LESSONS (MULTI-PORTION LEARNING) */}
          {activeStage === 'lessons' && activeLesson && (
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
              {/* Left Lesson Navigation List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Course Lessons:
                </span>
                {course.lessons.map((les, idx) => {
                  const isComp = isActivityCompleted(les.id);
                  const isSel = idx === activeLessonIdx;
                  return (
                    <button
                      key={les.id}
                      type="button"
                      onClick={() => setActiveLessonIdx(idx)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSel ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSel ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                        color: isSel ? '#ffffff' : 'var(--text-muted)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {les.title}
                      </div>
                      {isComp && <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>

              {/* Right: Lesson Portions Workspace */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
                      {activeLesson.title}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: 0 }}>
                      {activeLesson.description}
                    </p>
                  </div>

                  {isCurrentLessonComplete ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: '700' }}>
                      <CheckCircle2 size={16} /> Lesson Complete (+{activeLesson.points} pts)
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      Portions Completed: <strong style={{ color: 'var(--accent-cyan)' }}>{lessonPortionProgress?.completed}</strong> / {lessonPortionProgress?.total}
                    </div>
                  )}
                </div>

                {/* Portions Accordion / Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                  {activeLesson.portions?.map((port, pIdx) => {
                    const isPortionDone = isLessonPortionCompleted(activeLesson.id, pIdx);
                    return (
                      <div
                        key={pIdx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: isPortionDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontSize: '0.94rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                            {port.title}
                          </h4>
                          {isPortionDone && (
                            <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                              <CheckCircle2 size={13} /> Completed
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                          {port.content}
                        </p>

                        {!isPortionDone && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleCompletePortion(pIdx)}
                              className="btn-secondary"
                              style={{ padding: '6px 14px', fontSize: '0.78rem', gap: '6px' }}
                            >
                              <Check size={13} /> Mark Portion Read
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: PRACTICE QUESTIONS */}
          {activeStage === 'practice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Interactive Practice Questions
              </h3>

              {course.practice?.map((item, qIdx) => {
                const selected = practiceAnswers[qIdx];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === item.correctIndex;

                return (
                  <div key={item.id} className="glass-card" style={{ padding: '20px' }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', margin: '0 0 12px 0' }}>
                      {qIdx + 1}. {item.question}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                      {item.options.map((opt, oIdx) => {
                        let bg = 'rgba(255, 255, 255, 0.03)';
                        let border = 'rgba(255, 255, 255, 0.08)';

                        if (isAnswered) {
                          if (oIdx === item.correctIndex) {
                            bg = 'rgba(16, 185, 129, 0.2)';
                            border = '#10b981';
                          } else if (selected === oIdx) {
                            bg = 'rgba(239, 68, 68, 0.2)';
                            border = '#ef4444';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => setPracticeAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '8px',
                              background: bg,
                              border: `1px solid ${border}`,
                              color: 'var(--text-main)',
                              fontSize: '0.84rem',
                              fontWeight: '600',
                              textAlign: 'left',
                              cursor: isAnswered ? 'default' : 'pointer'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div style={{ marginTop: '12px', fontSize: '0.82rem', color: isCorrect ? '#34d399' : '#f87171' }}>
                        {isCorrect ? '✓ Correct!' : '✗ Explanation:'} {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* STAGE 5: VIDEOS */}
          {activeStage === 'videos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Curated Academic Video Lectures
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {course.videos?.map((vid) => {
                  const isDone = isActivityCompleted(vid.id);
                  return (
                    <div key={vid.id} className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px', background: '#000' }}>
                          <iframe
                            src={vid.videoUrl}
                            title={vid.title}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            allowFullScreen
                          />
                        </div>

                        <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#ffffff', margin: '0 0 6px 0' }}>
                          {vid.title}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Duration: {vid.duration}</span>
                      </div>

                      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isDone ? (
                          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={15} /> Completed (+{vid.points} pts)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCompleteVideo(vid)}
                            className="btn-primary"
                            style={{ padding: '6px 16px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
                          >
                            Mark Video Complete (+{vid.points} pts)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STAGE 6: PRACTICAL TASKS */}
          {activeStage === 'tasks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Practical Hands-on Tasks
              </h3>

              {course.tasks?.map((task) => {
                const isTaskDone = isActivityCompleted(task.id);
                return (
                  <div key={task.id} className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                        {task.title}
                      </h4>
                      {isTaskDone && (
                        <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={15} /> Completed (+{task.points} pts)
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                      {task.instructions}
                    </p>

                    <textarea
                      placeholder="Write your code or proof solution here..."
                      value={taskInputs[task.id] || ''}
                      onChange={(e) => setTaskInputs(prev => ({ ...prev, [task.id]: e.target.value }))}
                      className="input-field"
                      style={{ minHeight: '100px', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', marginBottom: '12px' }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setShowHint(!showHint)}
                        className="btn-secondary"
                        style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                      >
                        {showHint ? 'Hide Hint' : 'View Solution Hint'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCompleteTask(task)}
                        disabled={isTaskDone || !(taskInputs[task.id]?.trim())}
                        className="btn-primary"
                        style={{
                          padding: '7px 20px',
                          fontSize: '0.82rem',
                          opacity: isTaskDone || !(taskInputs[task.id]?.trim()) ? 0.5 : 1
                        }}
                      >
                        {isTaskDone ? 'Task Submitted' : `Submit Task (+${task.points} pts)`}
                      </button>
                    </div>

                    {showHint && task.solutionHint && (
                      <div style={{ marginTop: '12px', background: 'rgba(245, 158, 11, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.8rem', color: '#fcd34d' }}>
                        💡 Hint: {task.solutionHint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* STAGE 7: TESTS & ASSESSMENTS */}
          {activeStage === 'tests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Graded Chapter Tests & Formal Assessment
              </h3>

              {course.tests?.map((test) => {
                const isTestDone = isActivityCompleted(test.id);
                return (
                  <div key={test.id} className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                        {test.title}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: '700' }}>
                        Passing threshold: {test.passingScore || 70}%
                      </span>
                    </div>

                    {testResult && (
                      <div style={{
                        padding: '14px 18px',
                        borderRadius: '10px',
                        background: testResult.passed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        border: `1px solid ${testResult.passed ? '#10b981' : '#ef4444'}`,
                        marginBottom: '18px'
                      }}>
                        <div style={{ fontSize: '0.94rem', fontWeight: '700', color: testResult.passed ? '#34d399' : '#f87171' }}>
                          {testResult.passed ? `🎉 Test Passed (${testResult.percentage}%)!` : `Test score: ${testResult.percentage}%. Passing requires ${test.passingScore || 70}%.`}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {test.questions?.map((tq, qIdx) => (
                        <div key={qIdx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                          <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', margin: '0 0 10px 0' }}>
                            {qIdx + 1}. {tq.question}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                            {tq.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => setTestAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                style={{
                                  padding: '10px 12px',
                                  borderRadius: '8px',
                                  background: testAnswers[qIdx] === oIdx ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                                  border: testAnswers[qIdx] === oIdx ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                                  color: 'var(--text-main)',
                                  fontSize: '0.82rem',
                                  textAlign: 'left',
                                  cursor: 'pointer'
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => handleSubmitTest(test)}
                        disabled={Object.keys(testAnswers).length < test.questions.length}
                        className="btn-primary"
                        style={{
                          padding: '10px 24px',
                          fontSize: '0.84rem',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          opacity: Object.keys(testAnswers).length < test.questions.length ? 0.5 : 1
                        }}
                      >
                        Submit Test & Record Score (+{test.points} pts)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STAGE 8: CAPSTONE PROJECT & COMPLETION */}
          {activeStage === 'project' && course.project && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '26px', borderLeft: '4px solid var(--accent-purple)' }}>
                <span style={{ fontSize: '0.74rem', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '3px 10px', borderRadius: '4px', fontWeight: '700' }}>
                  STAGE 8 CAPSTONE
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', margin: '8px 0 6px 0' }}>
                  {course.project.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                  {course.project.description}
                </p>

                {isActivityCompleted(course.project.id) ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={24} color="#10b981" />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#34d399', margin: '0 0 2px 0' }}>
                        🎓 Capstone Milestone Achieved!
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
                        You have successfully verified your project and earned {course.project.points} completion points!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => handleCompleteProject(course.project)}
                      className="btn-primary"
                      style={{ padding: '10px 26px', fontSize: '0.88rem', background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
                    >
                      Verify & Submit Capstone Project (+{course.project.points} pts)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {loginModalConfig && (
        <LoginRequiredModal
          isOpen={Boolean(loginModalConfig)}
          onClose={() => setLoginModalConfig(null)}
          title={loginModalConfig.title}
          description={loginModalConfig.description}
          returnUrl={loginModalConfig.returnUrl}
        />
      )}
    </div>
  );
};

export default CourseViewer;
