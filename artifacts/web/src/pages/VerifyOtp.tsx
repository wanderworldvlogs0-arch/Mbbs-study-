import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Stethoscope, ArrowRight, ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { authApi, ApiError } from "../lib/api";

export function VerifyOtp() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const email = new URLSearchParams(search).get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await authApi.verifyOtp({ email, otp });
      navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
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

            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Enter your code</h1>
            <p className="text-slate-500 mb-8">
              We sent a 6-digit code to <span className="font-semibold text-slate-700">{email || "your email"}</span>.
              It expires in 10 minutes.
            </p>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 justify-center">
                <InputOTP maxLength={6} value={otp} onChange={value => { setOtp(value); setError(null); }}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify code
                    <ArrowRight style={{ width: 18, height: 18 }} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer inline-flex items-center gap-1">
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Try a different email
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
