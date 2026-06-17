import { createContext, useContext, useState, useEffect } from "react";
import { useFirebase } from "./Firebase";

const SubscriptionContext = createContext(null);
const BACKEND = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000";

export const PLANS = {
  free: {
    label: "Free",
    price: 0,
    aiQuizzesPerDay: 5,
    pdfUpload: 2,
    mcqTests: true,
    multiplayer: true,
  },
  pro: {
    label: "Pro",
    price: 99,
    aiQuizzesPerDay: Infinity,
    pdfUpload: 20,
    mcqTests: true,
    multiplayer: true,
  },
  premium: {
    label: "Premium",
    price: 199,
    aiQuizzesPerDay: Infinity,
    pdfUpload: 50,
    mcqTests: true,
    multiplayer: true,
  },
};

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const { user } = useFirebase();
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    if (!user) { setPlan("free"); return; }

    // Show cached plan instantly while we verify with server
    const stored = localStorage.getItem(`iq_sub_${user.uid}`);
    if (stored && PLANS[stored]) setPlan(stored);

    // Sync with backend — source of truth
    fetch(`${BACKEND}/api/subscription/status/${user.uid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.plan && PLANS[data.plan]) {
          setPlan(data.plan);
          localStorage.setItem(`iq_sub_${user.uid}`, data.plan);
        }
      })
      .catch(() => {}); // fall back to localStorage on network error
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
