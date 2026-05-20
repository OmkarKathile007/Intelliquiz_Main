import React from "react";
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

const assessmentModules = [
  {
    title: "CS Fundamentals Screening",
    route: "/mcqtest/CS_fundamentals",
    description:
      "Core CS, DBMS, OS, networking, and system fundamentals used in campus placement rounds.",
    difficulty: "Easy",
    duration: "18 min",
    questions: 20,
    completion: 72,
    category: ["Core CS", "Campus Prep", "Foundation"],
    accent: "from-cyan-400 to-blue-500",
    icon: Brain,
    students: "12.4k attempts",
  },
  {
    title: "DSA Fundamentals Assessment",
    route: "/mcqtest/DSA_fundamentals",
    description:
      "Data structures, algorithms, complexity analysis, and problem-solving concepts for technical hiring.",
    difficulty: "Medium",
    duration: "22 min",
    questions: 20,
    completion: 46,
    category: ["DSA", "Problem Solving", "Interview"],
    accent: "from-blue-400 to-violet-500",
    icon: Target,
    students: "9.8k attempts",
  },
  {
    title: "Online Assessment Simulator",
    route: "/mcqtest/Online_Assessment",
    description:
      "Mixed assessment round with realistic proctoring, time pressure, and company-style MCQ coverage.",
    difficulty: "Hard",
    duration: "25 min",
    questions: 20,
    completion: 28,
    category: ["OA", "Hiring", "Proctored"],
    accent: "from-fuchsia-400 to-cyan-400",
    icon: ShieldCheck,
    students: "15.1k attempts",
  },
];

const stats = [
  { label: "Questions solved", value: "248", icon: CheckCircle2 },
  { label: "Accuracy", value: "87%", icon: Gauge },
  { label: "Campus rank", value: "#412", icon: Trophy },
  { label: "Learning streak", value: "12d", icon: Flame },
  { label: "Assessments", value: "31", icon: Medal },
];

const sections = [
  {
    title: "Recommended assessments",
    items: ["CS Fundamentals Screening", "Online Assessment Simulator"],
    icon: Sparkles,
  },
  {
    title: "Recently attempted",
    items: ["DBMS Basics", "Arrays and Hashing"],
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

const difficultyStyles = {
  Easy: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Medium: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  Hard: "border-rose-300/30 bg-rose-300/10 text-rose-100",
};

const MCQTest = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.16),transparent_28%),linear-gradient(180deg,#020617_0%,#030712_42%,#000_100%)]" />
      <div className="absolute left-0 top-32 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            {/* <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              IntelliQuiz Assessment Cloud
            </div> */}
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Practice in a real enterprise assessment environment.
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
                  Placement Sprint 04
                </h2>
              </div>
              <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                <Brain className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
              <span>64% readiness score</span>
              <span>Next: DSA Fundamentals</span>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => {
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
                <p className="mt-5 text-2xl font-bold text-white">{stat.value}</p>
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
            {assessmentModules.map((module, index) => {
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
                      <span>Completion progress</span>
                      <span>{module.completion}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${module.accent}`}
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

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
        </section>
      </div>
    </main>
  );
};

export default MCQTest;
