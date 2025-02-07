import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const ConfettiAnimation = ({name}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCelebrate = () => {
    setShowConfetti(true);
    // Automatically stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 10000);
  };

  useEffect(() => {
    handleCelebrate();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false} // Stops confetti from recycling
        />
      )}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Congratulations {name}, You Win !
      </h1>
    </div>
  );
};

export default ConfettiAnimation;