import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ScoreBoard = ({ scores }) => {
  const [sortedScores, setSortedScores] = useState([...scores]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSorted = [...scores].sort((a, b) => b.score - a.score);
      setSortedScores(newSorted);
    }, 2000);

    return () => clearInterval(interval);
  }, [scores]);

  return (
    <div className="mt-6 bg-white border-2 border-green-300 bg-opacity-20 rounded-lg p-4 max-h-48 overflow-y-auto">
      <AnimatePresence>
        {sortedScores.map((p, idx) => (
          <motion.div
            key={p.name}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between mb-2"
          >
            <span>{idx + 1}. {p.name}</span>
            <span className={p.score >= 0 ? 'text-green-400' : 'text-red-400'}>
              {p.score}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ScoreBoard;
