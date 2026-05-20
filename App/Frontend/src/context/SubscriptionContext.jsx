import { createContext, useContext, useState, useEffect } from "react";
import { useFirebase } from "./Firebase";

const SubscriptionContext = createContext(null);

export const PLANS = {
  free: {
    label: "Free",
    price: 0,
    aiQuizzesPerDay: 5,
    pdfUpload: false,
    spacedRepetition: false,
    aiExplanations: false,
    placementPacks: false,
    mockTestsPerWeek: 1,
    studyGroups: false,
  },
  pro: {
    label: "Pro",
    price: 99,
    aiQuizzesPerDay: Infinity,
    pdfUpload: true,
    spacedRepetition: true,
    aiExplanations: true,
    placementPacks: false,
    mockTestsPerWeek: 5,
    studyGroups: true,
  },
  premium: {
    label: "Premium",
    price: 199,
    aiQuizzesPerDay: Infinity,
    pdfUpload: true,
    spacedRepetition: true,
    aiExplanations: true,
    placementPacks: true,
    mockTestsPerWeek: Infinity,
    studyGroups: true,
  },
};

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const { user } = useFirebase();
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    if (!user) { setPlan("free"); return; }
    const stored = localStorage.getItem(`iq_sub_${user.uid}`);
    setPlan(stored && PLANS[stored] ? stored : "free");
  }, [user]);

  const upgradePlan = (newPlan) => {
    if (!PLANS[newPlan]) return;
    setPlan(newPlan);
    if (user) localStorage.setItem(`iq_sub_${user.uid}`, newPlan);
  };

  const canAccess = (feature) => !!PLANS[plan]?.[feature];

  const getLimit = (feature) => PLANS[plan]?.[feature] ?? 0;

  return (
    <SubscriptionContext.Provider value={{ plan, upgradePlan, canAccess, getLimit, plans: PLANS }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
