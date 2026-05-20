import React, { useState } from "react";
import AssessmentPrecheck from "../AssessmentPrecheck";
import Quiz from "../Quiz";

const DSAfundamentals = () => {
  const [showPrecheck, setShowPrecheck] = useState(true);

  return showPrecheck ? (
    <AssessmentPrecheck
      title="DSA Fundamentals Assessment"
      category="Algorithms"
      duration="22 min"
      difficulty="Medium"
      onStart={() => setShowPrecheck(false)}
    />
  ) : (
    <Quiz id={2} quiz="DSA" title="DSA Fundamentals Assessment" />
  );
};

export default DSAfundamentals;
