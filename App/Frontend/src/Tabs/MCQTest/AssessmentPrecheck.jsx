import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ClipboardX,
  Eye,
  Fingerprint,
  Gauge,
  Lock,
  Mic,
  MonitorCheck,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";

const verificationSteps = [
  "Identity verification",
  "Device compatibility",
  "Permission validation",
  "Secure assessment launch",
];

const warningItems = [
  { icon: ShieldAlert, text: "Tab switching and focus loss are tracked." },
  { icon: ClipboardX, text: "Copy, paste, screenshots, and external tools are restricted." },
  { icon: Eye, text: "AI monitoring checks suspicious activity patterns." },
  { icon: Lock, text: "Fullscreen mode is required during secured attempts." },
];

const AssessmentPrecheck = ({ title, category, duration, difficulty, onStart }) => {
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaError, setMediaError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  const requestMedia = async () => {
    setMediaError("");
    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
    } catch (err) {
      setMediaError("Camera and microphone access was denied. Please allow permissions to continue.");
    } finally {
      setIsRequesting(false);
    }
  };

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => {
      setMediaError("Fullscreen mode could not be enabled in this browser.");
    });
  };

  const canStart = Boolean(mediaStream && isFullscreen && consent);

  const checks = [
    { label: "Webcam verification", status: mediaStream ? "Verified" : "Pending", icon: Camera, active: !!mediaStream },
    { label: "Microphone status", status: mediaStream ? "Live" : "Pending", icon: Mic, active: !!mediaStream },
    { label: "Fullscreen lock", status: isFullscreen ? "Enabled" : "Required", icon: MonitorCheck, active: isFullscreen },
    { label: "Internet stability", status: navigator.onLine ? "Stable" : "Offline", icon: Wifi, active: navigator.onLine },
    { label: "AI proctoring", status: "Ready", icon: Radio, active: true },
    { label: "System compatibility", status: "Passed", icon: Gauge, active: true },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-12 pt-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_75%_30%,rgba(124,58,237,0.14),transparent_30%),linear-gradient(180deg,#020617_0%,#030712_52%,#000_100%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              Secure assessment verification
            </div>
            <h1 className="text-3xl font-bold sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Complete the proctoring checks before entering the assessment.
              IntelliQuiz monitors permissions, fullscreen focus, network status,
              and suspicious activity signals during the attempt.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
            <Metric label="Category" value={category} />
            <Metric label="Duration" value={duration} />
            <Metric label="Level" value={difficulty} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Candidate identity check</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Face preview and permission state are shown locally for this session.
                </p>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                Encrypted session
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-cyan-300/15 bg-black/50">
              <div className="relative flex aspect-video items-center justify-center">
                {mediaStream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-80"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                      <Camera className="h-7 w-7" />
                    </div>
                    <p className="mt-4 text-sm text-slate-400">Webcam preview will appear here</p>
                  </div>
                )}
                <div className="absolute left-4 top-4 rounded-full border border-cyan-300/20 bg-black/50 px-3 py-1 text-xs text-cyan-100 backdrop-blur">
                  Face detection preview
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  {["Face centered", "Lighting OK", "No extra faces", "Audio ready"].map((item) => (
                    <div key={item} className="rounded-full border border-white/10 bg-black/45 px-3 py-2 text-center text-slate-200 backdrop-blur">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {mediaError && (
              <div className="mt-4 rounded-xl border border-rose-300/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {mediaError}
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={requestMedia}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-50 transition duration-300 hover:border-cyan-200/50 hover:bg-cyan-300/15 disabled:cursor-wait disabled:opacity-70"
                disabled={isRequesting}
              >
                <Camera className="h-4 w-4" />
                {isRequesting ? "Requesting access..." : mediaStream ? "Permissions active" : "Enable camera and mic"}
              </button>
              <button
                onClick={enterFullscreen}
                disabled={!mediaStream || isFullscreen}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-300/25 bg-blue-400/10 px-4 py-3 text-sm font-semibold text-blue-50 transition duration-300 hover:border-blue-200/50 hover:bg-blue-400/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MonitorCheck className="h-4 w-4" />
                {isFullscreen ? "Fullscreen enabled" : "Enter fullscreen"}
              </button>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
              <h2 className="text-xl font-semibold">Verification flow</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {verificationSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/10 bg-black/25 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/10 text-sm font-semibold text-cyan-100">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-white">{step}</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${index < 2 || canStart ? 100 : 52}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="grid gap-4 sm:grid-cols-2">
              {checks.map((check) => {
                const Icon = check.icon;
                return (
                  <div
                    key={check.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={check.active ? "h-5 w-5 text-cyan-200" : "h-5 w-5 text-slate-500"} />
                      {check.active ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-200" />
                      )}
                    </div>
                    <p className="mt-4 text-sm font-medium text-white">{check.label}</p>
                    <p className="mt-1 text-sm text-slate-400">{check.status}</p>
                  </div>
                );
              })}
            </div> */}

            <div className="rounded-3xl border border-amber-200/15 bg-amber-200/[0.055] p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-50">
                <AlertTriangle className="h-5 w-5" />
                Assessment security warnings
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {warningItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-100" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-300">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-black accent-cyan-400"
                />
                <span>
                  I confirm that I am the registered candidate, I will not use
                  external assistance, and I consent to AI proctoring signals for
                  this assessment session.
                </span>
              </label>

              <button
                onClick={onStart}
                disabled={!canStart}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200/30 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-700 px-5 py-4 text-sm font-semibold text-white shadow-[0_0_34px_rgba(34,211,238,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(34,211,238,0.36)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >
                <Fingerprint className="h-4 w-4" />
                Start secured assessment
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">
                Complete webcam, microphone, fullscreen, and consent checks to continue.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const Metric = ({ label, value }) => (
  <div className="min-w-[84px] rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
  </div>
);

export default AssessmentPrecheck;
