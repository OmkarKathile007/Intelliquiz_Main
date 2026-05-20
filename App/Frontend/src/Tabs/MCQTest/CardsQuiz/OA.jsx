import React, { useState } from "react";
import AssessmentPrecheck from "../AssessmentPrecheck";
import Quiz from "../Quiz";

const OA = () => {
  const [showPrecheck, setShowPrecheck] = useState(true);

  return showPrecheck ? (
    <AssessmentPrecheck
      title="Online Assessment Simulator"
      category="Hiring Round"
      duration="25 min"
      difficulty="Hard"
      onStart={() => setShowPrecheck(false)}
    />
  ) : (
    <Quiz id={3} quiz="OA" title="Online Assessment Simulator" />
  );
};

export default OA;
