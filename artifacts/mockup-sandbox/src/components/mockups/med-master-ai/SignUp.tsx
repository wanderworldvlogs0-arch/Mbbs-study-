import { useState } from "react";
import { Stethoscope, Eye, EyeOff, User, Mail, Lock, ChevronDown, ArrowRight, Chrome, GraduationCap } from "lucide-react";
import "./_group.css";

const MBBS_YEARS = ["MBBS Year 1", "MBBS Year 2", "MBBS Year 3 (Part I)", "MBBS Year 3 (Part II)", "MBBS Final Year", "House Officer / Intern", "PG Aspirant"];

export function SignUp() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", year: "", terms: false });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    return e;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.year) e.year = "Select your academic year";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    if (!form.terms) e.terms = "You must accept the terms";
    return e;
  };

  const handleNext = () => {
    const e = validateStep1();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validateStep2();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex items-center justify-center font-['Inter'] p-4">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <GraduationCap className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Account Created! 🎉</h2>
          <p className="text-slate-500 mb-1">Welcome to <strong className="text-blue-600">Dr.tragicMFA</strong>, {form.name.split(" ")[0]}!</p>
          <p className="text-slate-400 text-sm mb-8">Your journey to MBBS mastery begins now.</p>
          <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700 font-medium mb-6 border border-blue-100">
            🩺 <strong>Pro tip:</strong> Start with today's flashcard review for quick XP gains.
          </div>
          <button
            onClick={() => { setSuccess(false); setStep(1); setForm({ name: "", email: "", password: "", confirm: "", year: "", terms: false }); }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex items-center justify-center font-['Inter'] p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

          <div className="p-8 sm:p-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className="leading-none">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">Dr.</span>
                <span className="text-xl font-extrabold text-blue-600 tracking-tight">tragicMFA</span>
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 mb-6">Join 50,000+ MBBS students. 100% free to start.</p>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-blue-600" : "bg-slate-200"}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-blue-600" : "bg-slate-200"}`} />
            </div>

            {step === 1 ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Step 1 — Your details</p>
                {/* Name */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style={{ width: 18, height: 18 }} />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => update("name", e.target.value)}
                      placeholder="Dr. Arjun Mehta"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all
                        ${errors.name ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"}
                      `}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style={{ width: 18, height: 18 }} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update("email", e.target.value)}
                      placeholder="arjun@medschool.edu"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all
                        ${errors.email ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"}
                      `}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 active:scale-[0.98] mt-2"
                >
                  Continue <ArrowRight style={{ width: 18, height: 18 }} />
                </button>

                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <button className="w-full py-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm">
                  <Chrome style={{ width: 18, height: 18 }} className="text-blue-500" />
                  Sign up with Google
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Step 2 — Academic & security</p>

                {/* Year */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Academic Year</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style={{ width: 18, height: 18 }} />
                    <select
                      value={form.year}
                      onChange={e => update("year", e.target.value)}
                      className={`w-full pl-11 pr-10 py-3 rounded-xl border text-sm outline-none appearance-none transition-all bg-slate-50 text-slate-700
                        ${errors.year ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300" : "border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"}
                      `}
                    >
                      <option value="">Select your year…</option>
                      {MBBS_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ width: 16, height: 16 }} />
                  </div>
                  {errors.year && <p className="text-red-500 text-xs mt-1 font-medium">{errors.year}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style={{ width: 18, height: 18 }} />
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={e => update("password", e.target.value)}
                      placeholder="Min. 8 characters"
                      className={`w-full pl-11 pr-12 py-3 rounded-xl border text-sm outline-none transition-all
                        ${errors.password ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"}
                      `}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="flex gap-1 mt-2">
                      {[8, 10, 12].map((len, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${form.password.length >= len ? ["bg-red-400", "bg-yellow-400", "bg-green-500"][i] : "bg-slate-200"}`} />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1 self-center">{form.password.length < 8 ? "Weak" : form.password.length < 12 ? "Fair" : "Strong"}</span>
                    </div>
                  )}
                  {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                </div>

                {/* Confirm */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style={{ width: 18, height: 18 }} />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={e => update("confirm", e.target.value)}
                      placeholder="Re-enter your password"
                      className={`w-full pl-11 pr-12 py-3 rounded-xl border text-sm outline-none transition-all
                        ${errors.confirm ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300" : form.confirm && form.confirm === form.password ? "border-green-400 bg-green-50" : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"}
                      `}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showConfirm ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                  {errors.confirm && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirm}</p>}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <div
                    onClick={() => update("terms", !form.terms)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 mt-0.5
                      ${form.terms ? "bg-blue-600 border-blue-600" : errors.terms ? "border-red-400" : "border-slate-300 hover:border-blue-400"}
                    `}
                  >
                    {form.terms && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 select-none cursor-pointer" onClick={() => update("terms", !form.terms)}>
                    I agree to the <span className="text-blue-600 font-semibold">Terms of Service</span> and <span className="text-blue-600 font-semibold">Privacy Policy</span>
                  </p>
                </div>
                {errors.terms && <p className="text-red-500 text-xs font-medium -mt-2">{errors.terms}</p>}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3.5 px-5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
                  >
                    {loading ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                    ) : (
                      <>Create Account <ArrowRight style={{ width: 18, height: 18 }} /></>
                    )}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">Sign in</span>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-white/40 mt-6">© 2026 Dr.tragicMFA. All rights reserved.</p>
      </div>
    </div>
  );
}
