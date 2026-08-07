import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Stethoscope, ArrowRight, Mail, ArrowLeft } from "lucide-react";
import { authApi, ApiError } from "../lib/api";

export function ForgotPassword() {
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex items-center justify-center font-['Inter'] p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />

          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className="leading-none">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">Dr.</span>
                <span className="text-xl font-extrabold text-blue-600 tracking-tight">tragicMFA</span>
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Forgot your password?</h1>
            <p className="text-slate-500 mb-8">
              Enter your account email and we'll send you a 6-digit code to reset it.
            </p>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" style={{ width: 18, height: 18 }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(null); }}
                    placeholder="arjun@medschool.edu"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm transition-all outline-none border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending code...
                  </>
                ) : (
                  <>
                    Send reset code
                    <ArrowRight style={{ width: 18, height: 18 }} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer inline-flex items-center gap-1">
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back to sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          © 2026 Dr.tragicMFA. For MBBS exam preparation only.
        </p>
      </div>
    </div>
  );
}
