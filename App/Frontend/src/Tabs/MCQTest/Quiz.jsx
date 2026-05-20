import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Code2,
  Eye,
  FileText,
  Flag,
  Gauge,
  Keyboard,
  Lock,
  MonitorCheck,
  Radio,
  Save,
  Send,
  ShieldCheck,
  Signal,
  Timer,
  Wifi,
} from "lucide-react";
import CSfundamental_questions from "../../../../Backend/quizes/CSfundamental";
import { OAquiz } from "../../../../Backend/quizes/OAquiz";
import dsaQuiz from "../../../../Backend/quizes/DSAfundamentals";

const quizConfig = {
  1: {
    title: "CS Fundamentals Screening",
    candidate: "IntelliQuiz Candidate",
    duration: 18 * 60,
    level: "Easy",
    category: "Core CS",
  },
  2: {
    title: "DSA Fundamentals Assessment",
    candidate: "IntelliQuiz Candidate",
    duration: 22 * 60,
    level: "Medium",
    category: "Algorithms",
  },
  3: {
    title: "Online Assessment Simulator",
    candidate: "IntelliQuiz Candidate",
    duration: 25 * 60,
    level: "Hard",
    category: "Hiring Round",
  },
};

export default function Quiz({ id, title }) {
  const navigate = useNavigate();
  const selectedQuiz = id === 1 ? CSfundamental_questions : id === 2 ? dsaQuiz : OAquiz;
  const config = { ...quizConfig[id], title: title || quizConfig[id]?.title };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [reviewQuestions, setReviewQuestions] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [lastSaved, setLastSaved] = useState("Just now");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [warnings, setWarnings] = useState(0);
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");

  const currentQuestion = selectedQuiz[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = Math.round((answeredCount / selectedQuiz.length) * 100);
  const markedCount = Object.keys(reviewQuestions).filter((key) => reviewQuestions[key]).length;

  const score = useMemo(
    () =>
      selectedQuiz.reduce((total, question, questionIndex) => {
        const answerIndex = selectedAnswers[questionIndex];
        return total + (question.answers[answerIndex]?.correct ? 1 : 0);
      }, 0),
    [selectedAnswers, selectedQuiz]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowScore(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const autosave = setInterval(() => {
      setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 4500);
    return () => clearInterval(autosave);
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    const onVisibilityChange = () => {
      if (document.hidden) {
        setWarnings((count) => count + 1);
        setWarningMessage("Focus warning logged: tab switching is restricted during assessment.");
      }
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const resetIdle = () => setIdleSeconds(0);
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    const idleTimer = setInterval(() => {
      setIdleSeconds((seconds) => {
        const next = seconds + 1;
        if (next === 45) {
          setWarnings((count) => count + 1);
          setWarningMessage("Idle warning logged: no candidate activity detected for 45 seconds.");
        }
        return next;
      });
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      clearInterval(idleTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const selectAnswer = (answerIndex) => {
    setSelectedAnswers((answers) => ({
      ...answers,
      [currentQuestionIndex]: answerIndex,
    }));
    setLastSaved("Saving...");
    setTimeout(() => setLastSaved("Saved"), 500);
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < selectedQuiz.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const toggleReview = () => {
    setReviewQuestions((reviews) => ({
      ...reviews,
      [currentQuestionIndex]: !reviews[currentQuestionIndex],
    }));
  };

  if (showScore) {
    return (
      <main className="relative min-h-screen bg-black px-4 pb-12 pt-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_34%),linear-gradient(180deg,#020617_0%,#000_100%)]" />
        <section className="relative z-10 mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-bold sm:text-5xl">Assessment submitted</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Your secured attempt has been submitted and the candidate activity
            timeline has been finalized.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <ResultMetric label="Score" value={`${score}/${selectedQuiz.length}`} />
            <ResultMetric label="Accuracy" value={`${Math.round((score / selectedQuiz.length) * 100)}%`} />
            <ResultMetric label="Warnings" value={warnings} />
            <ResultMetric label="Reviewed" value={markedCount} />
          </div>
          <button
            onClick={() => navigate("/mcqtest")}
            className="mt-8 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-50 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
          >
            Return to assessment hub
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white lg:h-screen lg:overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_92%_16%,rgba(124,58,237,0.12),transparent_34%),linear-gradient(180deg,#020617_0%,#030712_48%,#000_100%)]" />
      <div className="relative z-10 flex min-h-screen flex-col pt-28 lg:h-screen lg:min-h-0">
        <AssessmentHeader
          config={config}
          time={formatTime(timeLeft)}
          progress={progress}
          isOnline={isOnline}
          isFullscreen={isFullscreen}
          lastSaved={lastSaved}
          warnings={warnings}
        />

        {warningMessage && (
          <div className="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm text-amber-50">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {warningMessage}
              </span>
              <button className="text-xs text-amber-100" onClick={() => setWarningMessage("")}>
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="assessment-shell mx-auto w-full max-w-[1600px] flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <QuestionSidebar
            selectedQuiz={selectedQuiz}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswers={selectedAnswers}
            reviewQuestions={reviewQuestions}
            goToQuestion={goToQuestion}
          />

          <section className="assessment-panel-scroll min-w-0 rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge icon={FileText} label={`Question ${currentQuestionIndex + 1}`} />
                  <Badge icon={Code2} label="MCQ" />
                  <Badge icon={Keyboard} label="Shortcuts enabled" />
                </div>
                <h1 className="mt-4 text-xl font-semibold leading-snug text-white sm:text-2xl xl:text-3xl">
                  {currentQuestion.question}
                </h1>
              </div>
              <button
                onClick={toggleReview}
                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  reviewQuestions[currentQuestionIndex]
                    ? "border-amber-200/40 bg-amber-200/15 text-amber-50"
                    : "border-white/10 bg-white/[0.06] text-slate-200 hover:border-amber-200/30"
                }`}
              >
                <Bookmark className="h-4 w-4" />
                {reviewQuestions[currentQuestionIndex] ? "Marked" : "Mark for review"}
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-300/10 bg-black/20 p-3 text-sm leading-6 text-slate-300">
              <p>
                Select the most appropriate answer. Your response is saved
                automatically and can be changed before final submission.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === index;
                return (
                  <motion.button
                    key={answer.text}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => selectAnswer(index)}
                    className={`group flex w-full items-start gap-4 rounded-2xl border p-3.5 text-left transition duration-300 ${
                      isSelected
                        ? "border-cyan-300/55 bg-cyan-300/12 shadow-[0_0_36px_rgba(34,211,238,0.16)]"
                        : "border-white/10 bg-black/24 hover:border-cyan-300/28 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                        isSelected
                          ? "border-cyan-200 bg-cyan-300 text-slate-950"
                          : "border-white/15 bg-white/[0.04] text-slate-300 group-hover:border-cyan-300/40"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="pt-1 text-sm leading-7 text-slate-100 sm:text-base">
                      {answer.text}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <RightSidebar
            timeLeft={timeLeft}
            duration={config.duration}
            progress={progress}
            answeredCount={answeredCount}
            total={selectedQuiz.length}
            warnings={warnings}
            idleSeconds={idleSeconds}
            isOnline={isOnline}
            markedCount={markedCount}
          />
        </div>

        <BottomActionBar
          currentQuestionIndex={currentQuestionIndex}
          total={selectedQuiz.length}
          goToQuestion={goToQuestion}
          toggleReview={toggleReview}
          onSubmit={() => setShowScore(true)}
          isCurrentAnswered={selectedAnswers[currentQuestionIndex] !== undefined}
        />
      </div>
    </main>
  );
}

const AssessmentHeader = ({ config, time, progress, isOnline, isFullscreen, lastSaved, warnings }) => (
  <header className="border-b border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-100">{config.category}</p>
        <h1 className="mt-1 text-lg font-semibold text-white sm:text-xl">{config.title}</h1>
        <p className="mt-1 text-sm text-slate-400">Candidate: {config.candidate}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <HeaderPill icon={Clock} label="Remaining" value={time} strong />
        <HeaderPill icon={MonitorCheck} label="Fullscreen" value={isFullscreen ? "Active" : "Warning"} active={isFullscreen} />
        <HeaderPill icon={Eye} label="Webcam" value="Monitoring" active />
        <HeaderPill icon={Wifi} label="Network" value={isOnline ? "Stable" : "Offline"} active={isOnline} />
        <HeaderPill icon={Save} label="Auto-save" value={lastSaved} active />
      </div>
    </div>
    <div className="mx-auto mt-3 max-w-7xl">
      <div className="mb-2 flex justify-between text-xs text-slate-400">
        <span>Assessment progress</span>
        <span>{progress}% complete · {warnings} warnings</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  </header>
);

const HeaderPill = ({ icon: Icon, label, value, active = true, strong = false }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2">
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <Icon className={active ? "h-4 w-4 text-cyan-200" : "h-4 w-4 text-amber-200"} />
      {label}
    </div>
    <p className={`mt-1 text-xs font-semibold ${strong ? "text-cyan-100" : "text-white"}`}>{value}</p>
  </div>
);

const QuestionSidebar = ({ selectedQuiz, currentQuestionIndex, selectedAnswers, reviewQuestions, goToQuestion }) => (
  <aside className="assessment-panel-scroll rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-white">Question navigator</h2>
      <Flag className="h-4 w-4 text-cyan-200" />
    </div>
    <div className="assessment-question-grid mt-4">
      {selectedQuiz.map((_, index) => {
        const answered = selectedAnswers[index] !== undefined;
        const reviewed = reviewQuestions[index];
        const current = currentQuestionIndex === index;
        return (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`relative h-9 rounded-lg border text-sm font-semibold transition ${
              current
                ? "border-cyan-200 bg-cyan-300 text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.3)]"
                : answered
                ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
                : "border-white/10 bg-black/25 text-slate-300 hover:border-cyan-300/25"
            }`}
          >
            {index + 1}
            {reviewed && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-300" />}
          </button>
        );
      })}
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300 lg:grid-cols-1">
      <Legend color="bg-cyan-300" label="Current" />
      <Legend color="bg-emerald-300" label="Answered" />
      <Legend color="bg-amber-300" label="Marked for review" />
      <Legend color="bg-slate-600" label="Unanswered" />
    </div>
  </aside>
);

const RightSidebar = ({ timeLeft, duration, progress, answeredCount, total, warnings, idleSeconds, isOnline, markedCount }) => {
  const timerProgress = timeLeft / duration;
  return (
    <aside className="assessment-panel-scroll space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <Timer className="h-5 w-5 text-cyan-200" />
          Time visualization
        </h2>
        <div className="mt-4 flex items-center justify-center">
          <svg className="h-24 w-24 -rotate-90">
            <circle cx="48" cy="48" r="34" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
            <circle
              cx="48"
              cy="48"
              r="34"
              stroke="rgb(34,211,238)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - timerProgress)}
            />
          </svg>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <SideMetric label="Answered" value={`${answeredCount}/${total}`} />
          <SideMetric label="Progress" value={`${progress}%`} />
          <SideMetric label="Review" value={markedCount} />
          <SideMetric label="Warnings" value={warnings} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <Radio className="h-5 w-5 text-cyan-200" />
          AI monitoring status
        </h2>
        <div className="mt-4 space-y-3">
          <StatusRow icon={ShieldCheck} label="Proctoring" value="Active" />
          <StatusRow icon={Signal} label="Connection" value={isOnline ? "Stable" : "Offline"} />
          <StatusRow icon={Activity} label="Activity tracking" value={`${idleSeconds}s idle`} />
          <StatusRow icon={Lock} label="Browser lock" value="Enforced" />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm leading-6 text-slate-300 backdrop-blur-xl">
        <h2 className="mb-3 font-semibold text-white">Assessment instructions</h2>
        <p>Use the navigator to revisit questions. Mark uncertain items for review and submit only after all answers are saved.</p>
      </div>
    </aside>
  );
};

const BottomActionBar = ({ currentQuestionIndex, total, goToQuestion, toggleReview, onSubmit, isCurrentAnswered }) => (
  <footer className="sticky bottom-0 border-t border-white/10 bg-black/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => goToQuestion(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          onClick={() => goToQuestion(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === total - 1}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={toggleReview}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm font-semibold text-amber-50 transition hover:border-amber-200/40"
        >
          <Bookmark className="h-4 w-4" />
          Mark for review
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-sm font-semibold text-emerald-50"
        >
          <Save className="h-4 w-4" />
          {isCurrentAnswered ? "Answer saved" : "Save answer"}
        </button>
      </div>
      <button
        onClick={onSubmit}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/30 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_34px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(34,211,238,0.36)]"
      >
        <Send className="h-4 w-4" />
        Submit assessment
      </button>
    </div>
  </footer>
);

const Badge = ({ icon: Icon, label }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs text-slate-300">
    <Icon className="h-3.5 w-3.5 text-cyan-200" />
    {label}
  </span>
);

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
    <span>{label}</span>
  </div>
);

const SideMetric = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 font-semibold text-white">{value}</p>
  </div>
);

const StatusRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm">
    <span className="flex items-center gap-2 text-slate-300">
      <Icon className="h-4 w-4 text-cyan-200" />
      {label}
    </span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

const ResultMetric = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-bold text-white">{value}</p>
  </div>
);
