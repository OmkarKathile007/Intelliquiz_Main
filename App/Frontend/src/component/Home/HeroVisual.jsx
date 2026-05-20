import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Brain,
  Cloud,
  GraduationCap,
  Network,
  ShieldCheck,
  BarChart3,
  Cpu,
  Sparkles,
} from "lucide-react";

// Palette
//  neon blue   #00D1FF
//  electric purple #8B5CF6
//  soft cyan   #67E8F9
//  violet      #A855F7

const ORBIT_ICONS = [
  { Icon: Brain, label: "AI", color: "#00D1FF", radius: 210, duration: 26, start: 0 },
  { Icon: Network, label: "Neural", color: "#67E8F9", radius: 210, duration: 26, start: 120 },
  { Icon: BarChart3, label: "Analytics", color: "#A855F7", radius: 210, duration: 26, start: 240 },
  { Icon: Cloud, label: "Cloud", color: "#67E8F9", radius: 275, duration: 38, start: 60 },
  { Icon: ShieldCheck, label: "Security", color: "#8B5CF6", radius: 275, duration: 38, start: 180 },
  { Icon: GraduationCap, label: "Learning", color: "#00D1FF", radius: 275, duration: 38, start: 300 },
];

// A single icon riding a circular orbit. The outer wrapper rotates the orbit;
// the inner wrapper counter-rotates so the glyph stays upright.
const OrbitIcon = ({ Icon, color, radius, duration, start }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 hidden md:block"
    style={{ x: "-50%", y: "-50%" }}
    initial={{ rotate: start }}
    animate={{ rotate: start + 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
  >
    <div style={{ transform: `translateX(${radius}px)` }}>
      <motion.div
        animate={{ rotate: -(start + 360) }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-md"
          style={{
            borderColor: `${color}55`,
            background: "rgba(5,8,22,0.55)",
            boxShadow: `0 0 18px ${color}33, inset 0 0 12px ${color}22`,
          }}
        >
          <Icon size={20} style={{ color }} />
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
);

// Floating glass HUD card with a soft breathing motion.
// const HudCard = ({ className, delay = 0, icon, label, value, accent }) => (
//   <motion.div
//     className={`absolute z-30 hidden items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 backdrop-blur-xl lg:flex ${className}`}
//     style={{ background: "rgba(5,8,22,0.6)", boxShadow: `0 8px 32px ${accent}22` }}
//     animate={{ y: [0, -10, 0], opacity: [0.85, 1, 0.85] }}
//     transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
//   >
//     <div
//       className="flex h-9 w-9 items-center justify-center rounded-xl"
//       style={{ background: `${accent}1f`, color: accent }}
//     >
//       {icon}
//     </div>
//     <div>
//       <div className="text-[10px] uppercase tracking-widest text-gray-400">{label}</div>
//       <div className="text-sm font-bold text-white">{value}</div>
//     </div>
//   </motion.div>
// );

const HeroVisual = ({ src, alt }) => {
  const wrapRef = useRef(null);

  // Mouse-reactive parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });

  const robotX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const robotY = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const auraX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const auraY = useTransform(sy, [-0.5, 0.5], [18, -18]);

  const handleMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={wrapRef}
      // onMouseMove={handleMove}
      // onMouseLeave={handleLeave}
      className="relative flex aspect-square w-full max-w-[340px] items-center justify-center sm:max-w-[420px] lg:max-w-[560px]"
    >
      {/* Volumetric ambient glow */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ x: auraX, y: auraY }}
      >
        <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,209,255,0.22),transparent_62%)] blur-2xl" />
        <div className="absolute left-[58%] top-[42%] h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.20),transparent_60%)] blur-2xl" />
      </motion.div>

      {/* Rotating wireframe rings */}
      {/* <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/20"
        style={{ transform: "translate(-50%,-50%) rotateX(72deg)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      /> */}

      {/* Conic energy sweep */}
      {/* <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(0,209,255,0.35) 30deg, transparent 70deg)",
          mask: "radial-gradient(circle, transparent 47%, black 48%, black 50%, transparent 51%)",
          WebkitMask:
            "radial-gradient(circle, transparent 47%, black 48%, black 50%, transparent 51%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      /> */}

      {/* Neural node network (SVG) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {[
          ["18", "30", "32", "20"],
          ["32", "20", "26", "48"],
          ["26", "48", "16", "66"],
          ["82", "34", "70", "24"],
          ["70", "24", "78", "52"],
          ["78", "52", "86", "70"],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#00D1FF"
            strokeWidth="0.25"
            strokeOpacity="0.4"
          />
        ))}
        {[
          [18, 30], [32, 20], [26, 48], [16, 66],
          [82, 34], [70, 24], [78, 52], [86, 70],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r="0.9"
            fill="#67E8F9"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* Floating particles */}
      {[...Array(14)].map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const size = (i % 3) + 1.5;
        return (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-cyan-300"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, filter: "blur(0.5px)" }}
            animate={{ y: [0, -22, 0], opacity: [0, 0.9, 0] }}
            transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          />
        );
      })}

      {/* Orbiting holographic icons */}
      {ORBIT_ICONS.map((cfg) => (
        <OrbitIcon key={cfg.label} {...cfg} />
      ))}

      {/* The robot — primary focus */}
      <motion.img
        src={src}
        alt={alt}
        style={{ x: robotX, y: robotY }}
        className="relative z-20 w-[82%] drop-shadow-[0_18px_45px_rgba(0,209,255,0.45)]"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vertical scanning line over the robot */}
      {/* <motion.div
        className=""
      >
        <motion.div
          className="absolute left-0 h-[2px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(103,232,249,0.9), transparent)",
            boxShadow: "0 0 12px rgba(103,232,249,0.8)",
          }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div> */}

      {/* HUD glass cards */}
      {/* <HudCard
        className="left-0 top-[18%]"
        delay={0}
        icon={<Cpu size={18} />}
        label="Neural Engine"
        value="1.2M nodes"
        accent="#00D1FF"
      />
      <HudCard
        className="right-0 top-[40%]"
        delay={1.2}
        icon={<Sparkles size={18} />}
        label="Accuracy"
        value="99.8%"
        accent="#A855F7"
      />
      <HudCard
        className="bottom-[14%] left-[6%]"
        delay={2.1}
        icon={<BarChart3 size={18} />}
        label="Live Sessions"
        value="3,420"
        accent="#67E8F9"
      /> */}
    </div>
  );
};

export default HeroVisual;
