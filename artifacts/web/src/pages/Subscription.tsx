import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Check, X, Zap, Crown, Sparkles, ArrowRight, Shield, RefreshCw, ChevronDown, Star,
} from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { subscriptionApi, ApiError } from "../lib/api";
import type { SubscriptionPlanId } from "@workspace/api-zod";

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    icon: Zap,
    iconBg: "bg-slate-100 dark:bg-slate-700",
    iconColor: "text-slate-600 dark:text-slate-300",
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null as string | null,
    accent: "border-slate-200 dark:border-slate-700",
    btnClass: "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900",
    description: "Everything to get started with your MBBS prep.",
    features: [
      { label: "20 MCQs / month", included: true },
      { label: "5 Flashcards / month", included: true },
      { label: "2 AI doubts / day", included: true },
      { label: "Basic progress tracking", included: true },
      { label: "Subject notes (5 subjects)", included: false },
      { label: "Unlimited MCQs", included: false },
      { label: "Video lectures", included: false },
      { label: "PYQ question bank", included: false },
      { label: "Performance analytics", included: false },
      { label: "Offline access", included: false },
    ],
  },
  {
    id: "pro" as const,
    name: "Pro",
    icon: Crown,
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    monthlyPrice: 149,
    yearlyPrice: 105,
    badge: "Most Popular" as string | null,
    accent: "border-blue-500 ring-2 ring-blue-500/20",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25",
    description: "Full access for serious MBBS exam preparation.",
    features: [
      { label: "Unlimited MCQs", included: true },
      { label: "Unlimited Flashcards", included: true },
      { label: "50 AI doubts / day", included: true },
      { label: "Advanced analytics dashboard", included: true },
      { label: "All 19 subjects + notes", included: true },
      { label: "Video lectures (HD)", included: false },
      { label: "PYQ question bank (10 yrs)", included: true },
      { label: "Mock tests (weekly)", included: true },
      { label: "Offline access", included: false },
      { label: "1-on-1 expert sessions", included: false },
    ],
  },
  {
    id: "elite" as const,
    name: "Elite",
    icon: Sparkles,
    iconBg: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    monthlyPrice: 499,
    yearlyPrice: 349,
    badge: "Best Value" as string | null,
    accent: "border-amber-400 ring-2 ring-amber-400/20",
    btnClass: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25",
    description: "The complete MBBS success system — nothing held back.",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Unlimited AI doubts", included: true },
      { label: "Offline access (all content)", included: false },
      { label: "1-on-1 expert sessions (2/mo)", included: true },
      { label: "AI performance predictions", included: true },
      { label: "Custom study plans by AI", included: true },
      { label: "Priority support (24/7)", included: true },
      { label: "Exam day strategy sessions", included: true },
      { label: "Early access to new features", included: true },
      { label: "Certificate on completion", included: true },
    ],
  },
];

const FAQ = [
  { q: "Can I switch plans anytime?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." },
  { q: "Is there a free trial for paid plans?", a: "Pro and Elite plans come with a 7-day free trial. No credit card required to start." },
  { q: "How does the annual billing work?", a: "Annual billing is charged once a year at the discounted rate. You save up to 30% compared to monthly billing." },
  { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards, UPI, Net Banking, and popular wallets like Paytm and PhonePe." },
  { q: "Can I share my account with classmates?", a: "Each account is personal and non-transferable. Group discounts are available for 5+ students — contact us for pricing." },
];

export function Subscription() {
  const [, navigate] = useLocation();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [activePlan, setActivePlan] = useState<SubscriptionPlanId | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    subscriptionApi
      .status()
      .then((s) => {
        setActivePlan(s.plan);
        setExpiresAt(s.subscriptionExpiresAt);
      })
      .catch(() => setActivePlan("free"));
  }, []);

  const handleSelectPlan = async (planId: SubscriptionPlanId) => {
    if (planId === activePlan || selectedPlan) return;
    setSelectedPlan(planId);
    setError(null);
    try {
      const s = await subscriptionApi.select(planId, billing);
      setActivePlan(s.plan);
      setExpiresAt(s.subscriptionExpiresAt);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not update your plan. Try again.");
    } finally {
      setSelectedPlan(null);
    }
  };

  const formatPrice = (monthly: number, yearly: number) => {
    const price = billing === "monthly" ? monthly : yearly;
    if (price === 0) return { main: "Free", sub: "forever" };
    return { main: `₹${price}`, sub: billing === "monthly" ? "/month" : "/month, billed annually" };
  };

  const activePlanLabel = PLANS.find((p) => p.id === activePlan)?.name ?? "Free";

  return (
    <AppLayout pageTitle="Subscription">
      <div className="max-w-6xl mx-auto p-5 md:p-8 pb-20 font-['Inter']">
        <button
          onClick={() => navigate("/settings")}
          className="text-blue-600 dark:text-blue-400 mb-4 text-sm font-medium"
        >
          ← Back
        </button>

        {showSuccess && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span className="font-semibold">Plan updated — welcome to {activePlanLabel} 🎉</span>
            <button onClick={() => setShowSuccess(false)} className="ml-2 text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-4 border border-blue-100 dark:border-blue-800/50">
            <Star className="w-4 h-4 fill-current" />
            Trusted by MBBS students
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Choose your study plan
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Invest in your future. MedMaster AI's plans are designed to take you from Day 1 to Distinction.
          </p>

          <div className="flex items-center justify-center gap-3 mt-7">
            <span className={`text-sm font-semibold transition-colors ${billing === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>Monthly</span>
            <button
              onClick={() => setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))}
              className={`relative w-12 h-6 rounded-full transition-colors ${billing === "yearly" ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${billing === "yearly" ? "left-7" : "left-1"}`} />
            </button>
            <span className={`text-sm font-semibold transition-colors ${billing === "yearly" ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>Annual</span>
            {billing === "yearly" && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800/50">
                Save up to 30%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-14">
          {PLANS.map((plan) => {
            const price = formatPrice(plan.monthlyPrice, plan.yearlyPrice);
            const isActive = activePlan === plan.id;
            const isLoading = selectedPlan === plan.id;
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-slate-800 rounded-3xl border-2 p-6 md:p-8 flex flex-col transition-all duration-300 hover:shadow-xl ${plan.accent} ${isActive ? "shadow-lg" : "hover:-translate-y-1"}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap
                    ${plan.id === "pro" ? "bg-blue-600 text-white" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"}
                  `}>
                    {plan.badge}
                  </div>
                )}

                {isActive && (
                  <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800/50">
                    Current plan
                  </div>
                )}
                {isActive && expiresAt && (
                  <p className="absolute top-11 right-4 text-[10px] text-slate-400 dark:text-slate-500">
                    Renews on {new Date(expiresAt).toLocaleDateString()}
                  </p>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.iconBg}`}>
                  <Icon className={`w-6 h-6 ${plan.iconColor}`} />
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{price.main}</span>
                    {plan.monthlyPrice > 0 && billing === "yearly" && (
                      <span className="text-sm text-slate-400 line-through ml-2 mb-1">₹{plan.monthlyPrice}</span>
                    )}
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{price.sub}</span>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isActive || isLoading || activePlan === null}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mb-6 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]
                    ${plan.btnClass}
                  `}
                >
                  {isLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : isActive ? (
                    <><Check className="w-4 h-4" /> Current Plan</>
                  ) : plan.id === "free" ? (
                    "Switch to Free"
                  ) : (
                    <>Get {plan.name} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-700 mb-5" />

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${f.included ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600"}`}>
                        {f.included ? <Check style={{ width: 12, height: 12 }} strokeWidth={3} /> : <X style={{ width: 12, height: 12 }} strokeWidth={3} />}
                      </div>
                      <span className={f.included ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500 line-through"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 -mt-10 mb-14">
          Payment isn't wired up yet — selecting a paid plan here switches your account's plan directly, no charge is made.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { icon: Shield, title: "Secure Payments", desc: "256-bit SSL encryption" },
            { icon: RefreshCw, title: "Cancel Anytime", desc: "No lock-in, no questions" },
            { icon: Zap, title: "Instant Access", desc: "Start learning immediately" },
            { icon: Star, title: "Loved by students", desc: "Built for MBBS prep" },
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <t.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
