// src/pages/auth/ResetPassword.jsx
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import http from "../../api/http";
import { FiLock } from "react-icons/fi";
import { FaBalanceScale } from "react-icons/fa";

const Schema = Yup.object({
  password: Yup.string().min(8, "Min 8 characters").required("Password is required"),
  confirm: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm your password"),
});

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0b]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_60%),radial-gradient(90%_70%_at_0%_0%,rgba(99,102,241,0.10)_0%,transparent_60%),radial-gradient(90%_70%_at_100%_0%,rgba(236,72,153,0.10)_0%,transparent_60%)]" />
      </div>

      <div className="w-full max-w-md px-4">
        <div className="relative">
          <div className="absolute -inset-[2px] rounded-3xl bg-[conic-gradient(from_140deg,rgba(99,102,241,.35),rgba(236,72,153,.35),rgba(16,185,129,.35),rgba(99,102,241,.35))] blur md:blur-md opacity-70" />
          <div className="relative rounded-3xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-xl bg-neutral-800 text-indigo-300 flex items-center justify-center ring-1 ring-white/10">
                <FaBalanceScale className="text-lg" />
              </div>
              <span className="text-2xl font-semibold text-slate-100">LexiBot</span>
            </div>

            <h1 className="text-xl font-bold text-center text-white">Reset Password</h1>
            <p className="text-center text-slate-400 text-sm mb-6">Choose a strong new password for your account.</p>

            <Formik
              initialValues={{ password: "", confirm: "" }}
              validationSchema={Schema}
              onSubmit={async (values, { setStatus, setSubmitting }) => {
                setStatus(null);
                try {
                  await http.post("/auth/reset", { email, token, newPassword: values.password });
                  navigate("/login");
                } catch {
                  setStatus("Invalid or expired reset link.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ status, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                        <FiLock />
                      </span>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter new password"
                        className="block w-full rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 pl-10 pr-3 py-2.5 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                      />
                    </div>
                    <ErrorMessage name="password" component="div" className="mt-1 text-xs text-rose-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                    <Field
                      type="password"
                      name="confirm"
                      placeholder="Re-enter new password"
                      className="block w-full rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 pl-3 pr-3 py-2.5 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                    />
                    <ErrorMessage name="confirm" component="div" className="mt-1 text-xs text-rose-400" />
                  </div>

                  {status && (
                    <div className="text-sm text-rose-300 bg-rose-900/20 border border-rose-500/30 rounded-md px-3 py-2">
                      {status}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl py-2.5 font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.35)] bg-[linear-gradient(135deg,#4338CA_0%,#6D28D9_30%,#7C3AED_55%,#DB2777_100%)] hover:shadow-[0_10px_40px_rgba(236,72,153,0.35)]"
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </button>

                  <p className="text-center text-sm text-slate-400">
                    Back to{" "}
                    <Link to="/login" className="text-indigo-300 hover:text-indigo-200 hover:underline">
                      Login
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
