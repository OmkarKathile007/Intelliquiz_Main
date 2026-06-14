import React, { useState, useEffect, useCallback } from "react";
import { useFirebase } from "../context/Firebase";
import { useSubscription } from "../context/SubscriptionContext";

const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000";

const AVATAR_COLORS = [
  "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#ef4444", "#3b82f6", "#f97316",
];

const DIFFICULTY_OPTIONS = [
  { value: "easy",   label: "Easy",   gradient: "from-emerald-500 to-teal-500",  glow: "shadow-emerald-500/40", ring: "ring-emerald-500/30" },
  { value: "medium", label: "Medium", gradient: "from-amber-500 to-orange-500",  glow: "shadow-amber-500/40",   ring: "ring-amber-500/30"   },
  { value: "hard",   label: "Hard",   gradient: "from-red-500 to-pink-600",      glow: "shadow-red-500/40",     ring: "ring-red-500/30"     },
];

function buildHeatmap() {
  const days = [];
  const today = new Date();
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none shrink-0 ${
        checked
          ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30"
          : "bg-gray-800 border border-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function Profile() {
  const { user } = useFirebase();
  const { plan } = useSubscription();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm]       = useState({ displayName: "", bio: "", avatarColor: "#06b6d4" });

  const heatmapDates = buildHeatmap();

  const fetchProfile = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const res  = await fetch(`${BASE_URL}/api/profile/${user.uid}`);
      const data = await res.json();
      setProfile(data);
      setForm({
        displayName: data.displayName || user.displayName || "",
        bio:         data.bio         || "",
        avatarColor: data.avatarColor || "#06b6d4",
      });
    } catch {}
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`${BASE_URL}/api/profile/${user.uid}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      setProfile(data);
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  const updatePref = async (key, value) => {
    const newPrefs = { ...profile.preferences, [key]: value };
    setProfile(p => ({ ...p, preferences: newPrefs }));
    try {
      const res  = await fetch(`${BASE_URL}/api/profile/${user.uid}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ preferences: newPrefs }),
      });
      const data = await res.json();
      setProfile(data);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-3 rounded-full border-2 border-purple-500/20 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  const activeSet    = new Set(profile?.streaks?.history || []);
  const todayStr     = new Date().toISOString().split("T")[0];
  const displayName  = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "User";
  const initial      = displayName.charAt(0).toUpperCase();
  const avatarColor  = form.avatarColor || "#06b6d4";
  const currentStreak  = profile?.streaks?.currentStreak ?? 0;
  const longestStreak  = profile?.streaks?.longestStreak ?? 0;
  const totalActiveDays = activeSet.size;

  const planConfig = {
    free:    { label: "Free",    gradient: "from-gray-500 to-gray-600",     glow: "",                       icon: "◆",  ring: "border-gray-500/30" },
    pro:     { label: "Pro",     gradient: "from-cyan-500 to-blue-600",     glow: "shadow-cyan-500/40",     icon: "✦",  ring: "border-cyan-500/40" },
    premium: { label: "Premium", gradient: "from-purple-500 to-pink-500",   glow: "shadow-purple-500/40",   icon: "⚡", ring: "border-purple-500/40" },
  }[plan] ?? { label: "Free", gradient: "from-gray-500 to-gray-600", glow: "", icon: "◆", ring: "border-gray-500/30" };

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-gray-950 to-purple-950/40" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient glow orbs */}
        <div
          className="absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: avatarColor }}
        />
        <div className="absolute -top-10 right-1/4 w-80 h-80 bg-purple-600 rounded-full blur-[100px] opacity-8 pointer-events-none" />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-gray-950" />

        <div className="relative pt-28 pb-14 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">

              {/* AVATAR */}
              <div className="relative shrink-0">
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl font-black text-white border border-white/10"
                  style={{
                    background: `linear-gradient(145deg, ${avatarColor}ee, ${avatarColor}88)`,
                    boxShadow: `0 0 0 1px ${avatarColor}30, 0 0 40px ${avatarColor}40, 0 24px 48px rgba(0,0,0,0.5)`,
                  }}
                >
                  {initial}
                </div>
                {currentStreak > 0 && (
                  <div className="absolute -bottom-2.5 -right-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/50 flex items-center gap-1 border border-orange-400/30">
                    🔥 {currentStreak}
                  </div>
                )}
              </div>

              {/* NAME & META */}
              <div className="flex-1 text-center sm:text-left pb-1">
                {editing ? (
                  <input
                    className="w-full sm:max-w-sm bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-2xl font-bold text-white placeholder-gray-600 mb-2 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    value={form.displayName}
                    onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                    placeholder="Display name"
                    maxLength={50}
                  />
                ) : (
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{displayName}</h1>
                )}

                <p className="text-gray-500 text-sm mt-1">{user?.email}</p>

                <div className="flex items-center gap-2.5 mt-3 justify-center sm:justify-start flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${planConfig.gradient} text-white shadow-lg ${planConfig.glow} border ${planConfig.ring}`}
                  >
                    {planConfig.icon} {planConfig.label}
                  </span>
                  {joinDate && (
                    <span className="text-xs text-gray-600 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Member since {joinDate}
                    </span>
                  )}
                </div>

                {editing ? (
                  <textarea
                    className="mt-4 w-full sm:max-w-md bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    rows={2}
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Write something about yourself…"
                    maxLength={200}
                  />
                ) : (
                  profile?.bio && (
                    <p className="mt-3 text-sm text-gray-400 max-w-md leading-relaxed">{profile.bio}</p>
                  )
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="shrink-0">
                {editing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setForm({ displayName: profile?.displayName || "", bio: profile?.bio || "", avatarColor: profile?.avatarColor || "#06b6d4" });
                      }}
                      className="px-4 py-2.5 text-sm font-semibold text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50"
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-300 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-400 rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Avatar color picker */}
            {editing && (
              <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Choose Avatar Color</p>
                <div className="flex gap-3 flex-wrap">
                  {AVATAR_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setForm(f => ({ ...f, avatarColor: c }))}
                      title={c}
                      className={`w-10 h-10 rounded-2xl transition-all duration-200 border-2 ${
                        form.avatarColor === c
                          ? "border-white scale-110"
                          : "border-transparent opacity-60 hover:opacity-90 hover:scale-105"
                      }`}
                      style={{
                        background: c,
                        boxShadow: form.avatarColor === c ? `0 0 16px ${c}80` : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick stats row */}
            {!editing && (
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { label: "Active Days",    value: totalActiveDays, icon: "📅", color: "from-cyan-400 to-teal-400",    glow: "shadow-cyan-500/20" },
                  { label: "Current Streak", value: `${currentStreak}d`, icon: "🔥", color: "from-orange-400 to-red-400",   glow: "shadow-orange-500/20" },
                  { label: "Best Streak",    value: `${longestStreak}d`, icon: "🏆", color: "from-purple-400 to-pink-400",  glow: "shadow-purple-500/20" },
                ].map(({ label, value, icon, color, glow }) => (
                  <div
                    key={label}
                    className={`relative bg-white/5 border border-white/8 rounded-2xl p-4 text-center overflow-hidden group hover:border-white/15 transition-all duration-300 shadow-xl ${glow}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-xl mb-2">{icon}</div>
                    <p className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                      {value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 space-y-4">

        {/* ── STREAK HEATMAP ── */}
        <div className="relative bg-gray-900/70 border border-white/8 rounded-2xl p-6 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500/15 border border-orange-500/20 rounded-xl flex items-center justify-center text-lg">
                🔥
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-widest uppercase">Learning Streak</h2>
                <p className="text-xs text-gray-500 mt-0.5">Activity over the last 16 weeks</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text">
                {currentStreak}
              </span>
              <span className="text-sm text-gray-500 ml-1.5">day streak</span>
            </div>
          </div>

          {/* Heatmap grid */}
          <div className="overflow-x-auto pb-2 -mx-1 px-1">
            <div className="flex gap-1.5 min-w-max">
              {Array.from({ length: 16 }, (_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1.5">
                  {Array.from({ length: 7 }, (_, dayIdx) => {
                    const flatIdx = weekIdx * 7 + dayIdx;
                    const date    = heatmapDates[flatIdx];
                    const active  = date && activeSet.has(date);
                    const isToday = date === todayStr;
                    return (
                      <div
                        key={dayIdx}
                        title={date || ""}
                        className={`w-4 h-4 rounded-[3px] transition-all duration-200 cursor-default ${
                          isToday && !active ? "ring-1 ring-cyan-500/50" : ""
                        }`}
                        style={
                          active
                            ? {
                                background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                                boxShadow: "0 0 8px rgba(6,182,212,0.5)",
                              }
                            : {
                                background: isToday
                                  ? "rgba(6,182,212,0.08)"
                                  : "rgba(255,255,255,0.04)",
                              }
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="w-4 h-4 rounded-[3px]" style={{ background: "rgba(255,255,255,0.04)" }} />
            <span className="text-xs text-gray-600">No activity</span>
            <div
              className="w-4 h-4 rounded-[3px] ml-2"
              style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", boxShadow: "0 0 6px rgba(6,182,212,0.4)" }}
            />
            <span className="text-xs text-gray-600">Active day</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs text-gray-600">{totalActiveDays} active days total</span>
            </div>
          </div>
        </div>

        {/* ── ADVANCED PREFERENCES ── */}
        <div className="relative bg-gray-900/70 border border-white/8 rounded-2xl p-6 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-7">
            <div className="w-9 h-9 bg-purple-500/15 border border-purple-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-purple-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-widest uppercase">Advanced Preferences</h2>
              <p className="text-xs text-gray-500 mt-0.5">Personalize your quiz experience</p>
            </div>
          </div>

          <div className="space-y-7">
            {/* Default Difficulty */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Default Quiz Difficulty</p>
              <div className="flex gap-2">
                {DIFFICULTY_OPTIONS.map(opt => {
                  const isActive = profile?.preferences?.defaultDifficulty === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => updatePref("defaultDifficulty", opt.value)}
                      className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all duration-200 ${
                        isActive
                          ? `bg-gradient-to-r ${opt.gradient} border-transparent text-white shadow-xl ${opt.glow}`
                          : "text-gray-500 border-white/8 hover:border-white/20 hover:text-gray-300 bg-transparent"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Toggle rows */}
            <div className="space-y-5">
              {[
                { key: "quizTimeWarnings",   label: "Quiz Time Warnings",   desc: "Get alerted when time is running low",           icon: "⏱" },
                { key: "showLeaderboard",    label: "Show on Leaderboard",  desc: "Display your rank on the campus leaderboard",    icon: "🏅" },
                { key: "publicProfile",      label: "Public Profile",       desc: "Allow other students to view your stats",        icon: "👥" },
                { key: "emailNotifications", label: "Email Notifications",  desc: "Receive quiz reminders and updates by email",    icon: "📧" },
              ].map(({ key, label, desc, icon }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-lg mt-0.5 shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-200">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                  <Toggle
                    checked={profile?.preferences?.[key] ?? false}
                    onChange={val => updatePref(key, val)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ACCOUNT INFO ── */}
        <div className="bg-gray-900/70 border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-500/15 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-widest uppercase">Account</h2>
              <p className="text-xs text-gray-500 mt-0.5">Your account details</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Email",       value: user?.email || "—" },
              { label: "Plan",        value: planConfig.label },
              { label: "Member Since", value: joinDate || "—" },
              { label: "User ID",     value: user?.uid ? `${user.uid.slice(0, 8)}…` : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="text-sm text-gray-300 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
