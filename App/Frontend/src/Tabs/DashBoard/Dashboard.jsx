
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#1e3a8a'];

/**
 * Dashboard component fetches and displays quiz statistics for a given player.
 * @param {Object} props
 * @param {Number} props.playerId - The ID of the player whose statistics to display.
 */
export default function DashBoard({ playerId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playerId) return;

    const fetchStats = async () => {
      try {
        // If you have set "proxy" in package.json to your backend, you can use a relative URL:
       // const res = await axios.get(`/dashboard/api/stats/${playerId}`);
        // Otherwise, use the full backend URL:
        const res = await axios.get(
          `http://localhost:5000/dashboard/api/stats/${playerId}`
        );
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [playerId]);

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="p-6 text-white w-full h-full bg-black">No data available.</div>;
  }

const { quizzesCompleted, correctPercentage, progress, leaderboard } = stats;
//   const { quizzesCompleted, correctPercentage, progress, leaderboard } = {
//   quizzesCompleted: 42,
//   correctPercentage: 78.3,
//   progress: [
//     { label: 'Session 1', value: 5 },
//     { label: 'Session 2', value: 8 },
//     { label: 'Session 3', value: 7 },
//     { label: 'Session 4', value: 10 },
//     { label: 'Session 5', value: 12 }
//   ],
//   leaderboard: [
//     { name: 'Alice', score: 120 },
//     { name: 'Bob', score: 110 },
//     { name: 'Charlie', score: 100 },
//     { name: 'You', score: 95 },
//     { name: 'Eve', score: 90 }
//   ]
// };

  console.log('Progress Data:', progress, 'Leaderboard Data:', leaderboard, 'Correct Percentage:', correctPercentage, 'Quizzes Completed:', quizzesCompleted, 'Player ID:', playerId);

  const donutData = [
    { name: 'Correct', value: correctPercentage },
    { name: 'Incorrect', value: 100 - correctPercentage },
  ];

  return (
    <div className="p-6 pt-36 bg-gray-900 min-h-screen  text-white space-y-8">
      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Quizzes Completed</h2>
          <p className="text-4xl font-bold">{quizzesCompleted}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Accuracy</h2>
          <p className="text-4xl font-bold">{correctPercentage}%</p>
        </div>
      </div>

      {/* Line chart for progress
      <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Progress Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis dataKey="date" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div> */}
      <ResponsiveContainer width="100%" height={300}>
  <LineChart data={progress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
    <XAxis dataKey="label" stroke="#fff" />
    <YAxis stroke="#fff" />
    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false}/>
  </LineChart>
</ResponsiveContainer>

      {/* Donut chart for accuracy breakdown */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Accuracy Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={donutData}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <PieTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow-md text-white">
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <table className="min-w-full bg-gray-900">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(({ playerName, score }, idx) => (
              <tr key={playerName} className="border-t border-gray-700">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{playerName}</td>
                <td className="px-4 py-2 text-right">{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
