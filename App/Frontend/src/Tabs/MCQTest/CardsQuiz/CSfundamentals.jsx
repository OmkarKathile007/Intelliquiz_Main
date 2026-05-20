import React, { useState } from "react";
import AssessmentPrecheck from "../AssessmentPrecheck";
import Quiz from "../Quiz";

const CSfundamentals = () => {
  const [showPrecheck, setShowPrecheck] = useState(true);

  return showPrecheck ? (
    <AssessmentPrecheck
      title="CS Fundamentals Screening"
      category="Core CS"
      duration="18 min"
      difficulty="Easy"
      onStart={() => setShowPrecheck(false)}
    />
  ) : (
    <Quiz id={1} quiz="CS" title="CS Fundamentals Screening" />
  );
};

export default CSfundamentals;
