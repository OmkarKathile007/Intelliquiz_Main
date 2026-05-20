// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const ScoreBoard = ({ scores }) => {
//   const [sortedScores, setSortedScores] = useState([...scores]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const newSorted = [...scores].sort((a, b) => b.score - a.score);
//       setSortedScores(newSorted);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [scores]);

//   return (
//     <div className="mt-6 bg-white border-2 border-green-300 bg-opacity-20 rounded-lg p-4 max-h-48 overflow-y-auto">
//       <AnimatePresence>
//         {sortedScores.map((p, idx) => (
//           <motion.div
//             key={p.name}
//             layout
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.5 }}
//             className="flex justify-between mb-2"
//           >
//             <span>{idx + 1}. {p.name}</span>
//             <span className={p.score >= 0 ? 'text-green-400' : 'text-red-400'}>
//               {p.score}
//             </span>
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ScoreBoard;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MEDALS = ["🥇", "🥈", "🥉"];

const ScoreBoard = ({ scores = [], final = false }) => {
  const [sorted, setSorted] = useState([]);

  useEffect(() => {
    setSorted([...scores].sort((a, b) => b.score - a.score));
  }, [scores]);

  if (sorted.length === 0) return null;

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      final
        ? "bg-white/5 border-white/10"
        : "bg-white/3 border-white/8 backdrop-blur-sm"
    }`}>
      <div className="px-5 py-3 border-b border-white/8">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {final ? "Final Standings" : "Live Scoreboard"}
        </h3>
      </div>

      <div className={`divide-y divide-white/5 ${!final ? "max-h-52 overflow-y-auto" : ""}`}>
        <AnimatePresence initial={false}>
          {sorted.map((p, idx) => (
            <motion.div
              key={p.name}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex items-center gap-3 px-5 py-3"
            >
              <span className="text-lg w-6 text-center shrink-0">
                {idx < 3 ? MEDALS[idx] : <span className="text-gray-600 text-sm font-bold">{idx + 1}</span>}
              </span>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${idx === 0 ? "text-yellow-300" : "text-gray-200"}`}>
                  {p.name}
                </p>
              </div>

              <motion.span
                key={`${p.name}-${p.score}`}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className={`text-sm font-bold tabular-nums px-2.5 py-1 rounded-lg ${
                  p.score > 0
                    ? "text-emerald-400 bg-emerald-500/10"
                    : p.score < 0
                    ? "text-red-400 bg-red-500/10"
                    : "text-gray-500 bg-white/5"
                }`}
              >
                {p.score > 0 ? "+" : ""}{p.score}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScoreBoard;
