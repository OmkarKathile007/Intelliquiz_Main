import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarClock,
  CheckCircle2,
  Flame,
  Gauge,
  GraduationCap,
  Medal,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import { useFirebase } from "../../context/Firebase";

const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000";

const assessmentModules = [
  {
    title: "CS Fundamentals Screening",
    route: "/mcqtest/CS_fundamentals",
    description:
      "Core CS, DBMS, OS, networking, and system fundamentals used in campus placement rounds.",
    difficulty: "Easy",
    duration: "18 min",
    questions: 20,
    quizId: 1,
    category: ["Core CS", "Campus Prep", "Foundation"],
    accent: "from-cyan-400 to-blue-500",
    icon: Brain,
  },
  {
    title: "DSA Fundamentals Assessment",
    route: "/mcqtest/DSA_fundamentals",
    description:
      "Data structures, algorithms, complexity analysis, and problem-solving concepts for technical hiring.",
    difficulty: "Medium",
    duration: "22 min",
    questions: 20,
    quizId: 2,
    category: ["DSA", "Problem Solving", "Interview"],
    accent: "from-blue-400 to-violet-500",
    icon: Target,
  },
  {
    title: "Online Assessment Simulator",
    route: "/mcqtest/Online_Assessment",
    description:
      "Mixed assessment round with realistic proctoring, time pressure, and company-style MCQ coverage.",
    difficulty: "Hard",
    duration: "25 min",
    questions: 20,
    quizId: 3,
    category: ["OA", "Hiring", "Proctored"],
    accent: "from-fuchsia-400 to-cyan-400",
    icon: ShieldCheck,
  },
];

const difficultyStyles = {
  Easy: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Medium: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  Hard: "border-rose-300/30 bg-rose-300/10 text-rose-100",
};

function formatAttempts(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k attempts`;
  return `${n} attempt${n !== 1 ? "s" : ""}`;
}

const MCQTest = () => {
  const { user } = useFirebase();
  const [userStats, setUserStats]           = useState(null);
  const [moduleStats, setModuleStats]       = useState([]);
  const [userModuleStats, setUserModuleStats] = useState([]);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }

    Promise.all([
      fetch(`${BASE_URL}/quiz/api/user-stats/${user.uid}`).then((r) => r.json()),
      fetch(`${BASE_URL}/quiz/api/module-stats`).then((r) => r.json()),
      fetch(`${BASE_URL}/quiz/api/user-module-stats/${user.uid}`).then((r) => r.json()),
    ])
      .then(([stats, modStats, userModStats]) => {
        setUserStats(stats?.questionsAnswered != null ? stats : null);
        setModuleStats(Array.isArray(modStats) ? modStats : []);
        setUserModuleStats(Array.isArray(userModStats) ? userModStats : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const statCards = [
    { label: "Questions solved", value: userStats ? String(userStats.questionsAnswered) : "—", icon: CheckCircle2 },
    { label: "Accuracy",         value: userStats ? `${userStats.accuracy}%` : "—",             icon: Gauge },
    { label: "Campus rank",      value: userStats?.campusRank ? `#${userStats.campusRank}` : "—", icon: Trophy },
    { label: "Learning streak",  value: userStats ? `${userStats.learningStreak}d` : "—",        icon: Flame },
    { label: "Assessments",      value: userStats ? String(userStats.assessmentsCompleted) : "—", icon: Medal },
  ];

  const recentItems = userStats?.recentAttempts?.length
    ? userStats.recentAttempts
    : ["No attempts yet"];

  const sections = [
    {
      title: "Recommended assessments",
      items: userStats?.nextRecommended
        ? [userStats.nextRecommended, "Online Assessment Simulator"].filter(
            (v, i, arr) => arr.indexOf(v) === i
          )
        : ["CS Fundamentals Screening", "Online Assessment Simulator"],
      icon: Sparkles,
    },
    {
      title: "Recently attempted",
      items: recentItems,
      icon: CalendarClock,
    },
    {
      title: "Popular among students",
      items: ["DSA Fundamentals", "Operating Systems MCQ"],
      icon: Users,
    },
    {
      title: "Placement preparation tracks",
      items: ["Product Companies", "Service-Based Hiring"],
      icon: GraduationCap,
    },
  ];

  const dynamicModules = assessmentModules.map((mod) => {
    const globalStat = moduleStats.find((s) => s._id === mod.quizId);
    const userStat   = userModuleStats.find((s) => s._id === mod.quizId);
    const totalAttempts = globalStat?.totalAttempts ?? 0;
    const completion    = Math.round(userStat?.bestAccuracy ?? 0);
    return {
      ...mod,
      completion,
      students: totalAttempts > 0 ? formatAttempts(totalAttempts) : "0 attempts",
    };
  });

  const readinessScore = userStats?.readinessScore ?? 0;
  const sprintNumber   = userStats?.sprintNumber   ?? "01";
  const nextQuiz       = userStats?.nextRecommended ?? "CS Fundamentals Screening";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.16),transparent_28%),linear-gradient(180deg,#020617_0%,#030712_42%,#000_100%)]" />
      <div className="absolute left-0 top-32 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Practice in a real assessment environment.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Build placement readiness with proctored-style modules, AI-guided
              recommendations, professional analytics, and realistic hiring
              platform workflows.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_0_60px_rgba(34,211,238,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">AI recommended path</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Placement Sprint {sprintNumber}
                </h2>
              </div>
              <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                <Brain className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
              <span>{loading ? "…" : `${readinessScore}% readiness score`}</span>
              <span>Next: {nextQuiz}</span>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-cyan-200" />
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
                </div>
                <p className="mt-5 text-2xl font-bold text-white">{loading ? "…" : stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </section>

        <section className="mt-12">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Premium assessment modules
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Company-style assessments with progress tracking and secure exam
                metadata.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
              <Timer className="h-4 w-4 text-cyan-200" />
              Auto-saved practice sessions
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {dynamicModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.article
                  key={module.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_28px_90px_rgba(34,211,238,0.12)]"
                >
                  <div className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r ${module.accent} opacity-70`} />
                  <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/20" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className={`rounded-2xl bg-gradient-to-br ${module.accent} p-3 text-white shadow-lg shadow-cyan-950/40`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyStyles[module.difficulty]}`}>
                        {module.difficulty}
                      </span>
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                        AI-generated
                      </span>
                    </div>
                  </div>

                  <h3 className="relative mt-6 text-2xl font-semibold leading-tight text-white">
                    {module.title}
                  </h3>
                  <p className="relative mt-3 min-h-[84px] text-sm leading-7 text-slate-300">
                    {module.description}
                  </p>

                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {module.category.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="relative mt-6 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-slate-500">Duration</p>
                      <p className="mt-1 font-semibold text-white">{module.duration}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-slate-500">Questions</p>
                      <p className="mt-1 font-semibold text-white">{module.questions}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-slate-500">Attempts</p>
                      <p className="mt-1 font-semibold text-white">{module.students}</p>
                    </div>
                  </div>

                  <div className="relative mt-6">
                    <div className="mb-2 flex justify-between text-xs text-slate-400">
                      <span>Your best score</span>
                      <span>{module.completion}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${module.accent} transition-all duration-700`}
                        style={{ width: `${module.completion}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to={module.route}
                    className="relative mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-50 transition duration-300 hover:border-cyan-200/50 hover:bg-cyan-300/15"
                  >
                    Launch secure assessment
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">{section.title}</h3>
                </div>
                <div className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300"
                    >
                      <span>{item}</span>
                      <BarChart3 className="h-4 w-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section> */}
      </div>
    </main>
  );
};

export default MCQTest;
