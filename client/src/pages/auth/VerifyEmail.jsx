// src/pages/auth/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import http from "../../api/http";
import { FaBalanceScale } from "react-icons/fa";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true, message: "", success: false });

  useEffect(() => {
    const verify = async () => {
      const verificationToken = params.get("token");
      const email = params.get("email");

      if (!verificationToken || !email) {
        setStatus({
          loading: false,
          message: "Invalid verification link. Missing token or email.",
          success: false,
        });
        return;
      }

      try {
        const { data } = await http.get("/auth/verify-email", {
          params: { token: verificationToken, email },
        });
        
        setStatus({
          loading: false,
          message: data.message || "Email verified successfully! You can now sign in.",
          success: true,
        });
        // Redirect to login page after successful verification
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        console.error("Verification error:", err);
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           "Verification failed. The link may be invalid or expired.";
        setStatus({
          loading: false,
          message: errorMessage,
          success: false,
        });
      }
    };

    verify();
  }, [params, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0b]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_60%),radial-gradient(90%_70%_at_0%_0%,rgba(99,102,241,0.10)_0%,transparent_60%),radial-gradient(90%_70%_at_100%_0%,rgba(236,72,153,0.10)_0%,transparent_60%)]" />
      </div>

      <div className="w-full max-w-md px-4">
        <div className="relative">
          <div className="absolute -inset-[2px] rounded-3xl bg-[conic-gradient(from_140deg,rgba(99,102,241,.35),rgba(236,72,153,.35),rgba(16,185,129,.35),rgba(99,102,241,.35))] blur md:blur-md opacity-70" />
          <div className="relative rounded-3xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-neutral-800 text-indigo-300 flex items-center justify-center ring-1 ring-white/10">
                <FaBalanceScale className="text-lg" />
              </div>
              <span className="text-2xl font-semibold text-slate-100">LexiBot</span>
            </div>

            {status.loading ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
                <h1 className="text-xl font-bold text-center text-white mb-2">Verifying your email...</h1>
                <p className="text-center text-slate-400 text-sm">Please wait while we verify your account.</p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  {status.success ? (
                    <FiCheckCircle className="text-6xl text-green-500" />
                  ) : (
                    <FiXCircle className="text-6xl text-rose-500" />
                  )}
                </div>
                <h1 className="text-xl font-bold text-center text-white mb-2">
                  {status.success ? "Email Verified!" : "Verification Failed"}
                </h1>
                <p
                  className={`text-center text-sm mb-6 ${
                    status.success ? "text-indigo-200" : "text-rose-300"
                  }`}
                >
                  {status.message}
                </p>
                {status.success && (
                  <p className="text-center text-xs text-slate-400 mb-6">
                    Redirecting to login page in 3 seconds...
                  </p>
                )}
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center rounded-xl py-2.5 font-semibold text-white
                               shadow-[0_8px_30px_rgba(99,102,241,0.35)]
                               bg-[linear-gradient(135deg,#4338CA_0%,#6D28D9_30%,#7C3AED_55%,#DB2777_100%)]
                               hover:shadow-[0_10px_40px_rgba(236,72,153,0.35)]
                               transition-all"
                  >
                    Go to Login
                  </Link>
                  {!status.success && (
                    <Link
                      to="/register"
                      className="flex-1 text-center rounded-xl border border-white/15 bg-neutral-900/40 text-slate-200 py-2.5
                                 hover:bg-neutral-800/60 transition-colors"
                    >
                      Register Again
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

