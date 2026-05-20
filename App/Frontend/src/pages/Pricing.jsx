import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import { useSubscription, PLANS } from "../context/SubscriptionContext";

const BACKEND = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000";

const CheckIcon = () => (
  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FEATURES = [
  { key: "aiQuizzesPerDay",   label: "AI Quiz generations / day",  format: (v) => (v === Infinity ? "Unlimited" : `${v}/day`) },
  { key: "pdfUpload",         label: "PDF / Notes upload",         format: (v) => v },
  { key: "aiExplanations",    label: "AI explanations on wrong answers", format: (v) => v },
  { key: "spacedRepetition",  label: "Spaced repetition system",   format: (v) => v },
  { key: "placementPacks",    label: "Placement prep packs (TCS, Infosys, FAANG)", format: (v) => v },
  { key: "mockTestsPerWeek",  label: "Mock tests / week",          format: (v) => (v === Infinity ? "Unlimited" : `${v}/week`) },
  { key: "studyGroups",       label: "Private study groups",       format: (v) => v },
];

const PLAN_CONFIGS = [
  {
    key: "free",
    badge: null,
    gradient: "from-gray-800 to-gray-900",
    border: "border-gray-700",
    btnClass: "bg-gray-700 hover:bg-gray-600 text-white",
    tagline: "Get started for free",
  },
  {
    key: "pro",
    badge: "Most Popular",
    gradient: "from-blue-900 to-cyan-900",
    border: "border-cyan-500",
    btnClass: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25",
    tagline: "Perfect for serious students",
  },
  {
    key: "premium",
    badge: "Best Value",
    gradient: "from-purple-900 to-pink-900",
    border: "border-purple-500",
    btnClass: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25",
    tagline: "For placement warriors",
  },
];

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Pricing() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useFirebase();
  const { plan: currentPlan, upgradePlan } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleUpgrade = async (planKey) => {
    if (!isLoggedIn) { navigate("/signup"); return; }
    if (planKey === "free" || planKey === currentPlan) return;

    setLoadingPlan(planKey);
    try {
      const ready = await loadRazorpay();
      if (!ready) throw new Error("Razorpay failed to load.");

      const res = await fetch(`${BACKEND}/api/subscription/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, userId: user.uid }),
      });

      if (!res.ok) throw new Error("Could not create order.");
      const { orderId, amount, currency, keyId } = await res.json();

      const options = {
        key: keyId,
        amount,
        currency,
        name: "IntelliQuiz",
        description: `${PLANS[planKey].label} Plan – ₹${PLANS[planKey].price}/mo`,
        order_id: orderId,
        prefill: { email: user.email, name: user.displayName || "" },
        theme: { color: "#06b6d4" },
        handler: async (response) => {
          const verify = await fetch(`${BACKEND}/api/subscription/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, plan: planKey, userId: user.uid }),
          });
          if (verify.ok) {
            upgradePlan(planKey);
            navigate("/main");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Payment could not be initiated. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-20">
      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Invest in your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              placement success
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Choose the plan that fits your goals. Upgrade or cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLAN_CONFIGS.map(({ key, badge, gradient, border, btnClass, tagline }) => {
            const planData = PLANS[key];
            const isCurrent = currentPlan === key;
            const isLoading = loadingPlan === key;

            return (
              <div
                key={key}
                className={`relative bg-gradient-to-b ${gradient} border ${border} rounded-2xl p-8 flex flex-col ${
                  badge ? "ring-1 ring-cyan-500/30" : ""
                }`}
              >
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xs font-bold text-white shadow">
                      {badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1">{planData.label}</h2>
                  <p className="text-gray-400 text-sm mb-4">{tagline}</p>
                  <div className="flex items-baseline gap-1">
                    {planData.price === 0 ? (
                      <span className="text-4xl font-extrabold">Free</span>
                    ) : (
                      <>
                        <span className="text-xl font-semibold text-gray-400">₹</span>
                        <span className="text-4xl font-extrabold">{planData.price}</span>
                        <span className="text-gray-400 text-sm">/month</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {FEATURES.map(({ key: fKey, label, format }) => {
                    const val = planData[fKey];
                    const active = val === true || (typeof val === "number" && val > 0);
                    return (
                      <li key={fKey} className="flex items-start gap-2.5 text-sm">
                        {active ? <CheckIcon /> : <CrossIcon />}
                        <span className={active ? "text-gray-200" : "text-gray-500"}>
                          {typeof val === "boolean"
                            ? label
                            : `${label} — ${format(val)}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <button
                  onClick={() => handleUpgrade(key)}
                  disabled={isCurrent || isLoading || key === "free"}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${btnClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Processing…
                    </span>
                  ) : isCurrent ? (
                    "Current Plan"
                  ) : key === "free" ? (
                    "Get Started Free"
                  ) : (
                    `Upgrade to ${planData.label}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Secure payments powered by Razorpay &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; INR billing &nbsp;·&nbsp; No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
}
