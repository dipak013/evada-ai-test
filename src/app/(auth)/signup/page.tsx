"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UnifiedAPIService } from "@/services/unified-api.service";
import { buildSsoAuthorizeUrl, SsoProvider } from "@/services/sso.service";
import axios from "axios";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isStrongPassword(value: string): boolean {
  if (value.length < 12) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  if (!/[^A-Za-z0-9]/.test(value)) return false;
  if (/\s/.test(value)) return false;
  return true;
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setError("");

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedTenantName = tenantName.trim();

    if (!trimmedFullName) {
      setError("Full Name is required.");
      return;
    }

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!trimmedTenantName) {
      setError("Workspace Name is required.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError("Password must be at least 12 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    setIsLoading(true);

    try {
      await UnifiedAPIService.auth.getCsrf();

      const response = await UnifiedAPIService.auth.register({
        email: trimmedEmail,
        password,
        username: trimmedFullName,
        tenant_name: trimmedTenantName,
      });

      if (response.data.status === "ok") {
        router.push("/dashboard");
        return;
      }

      setError("Unable to sign up. Please try again.");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.error ||
            err.response.data?.detail ||
            err.response.data?.message ||
            "Sign up failed"
        );
      } else if (axios.isAxiosError(err) && err.request) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSsoSignup = (provider: SsoProvider) => {
    setError("");
    try {
      globalThis.location.href = buildSsoAuthorizeUrl(provider, "signup");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "SSO is not configured. Please contact administrator.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-100 via-indigo-100 to-slate-200 relative overflow-hidden">
      <div className="absolute top-10 right-20 w-32 h-32 md:w-64 md:h-64 bg-indigo-300 rounded-full opacity-25 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 md:w-80 md:h-80 bg-cyan-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="w-full min-h-screen flex items-center justify-center relative p-4 md:p-8 z-10">
        <Link
          href="/#home"
          className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur hover:bg-white"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Home</span>
        </Link>
        <div className="bg-white/90 border border-slate-200/70 backdrop-blur-md w-full max-w-md mx-auto p-7 md:p-9 rounded-3xl shadow-[0_30px_70px_-28px_rgba(15,23,42,0.42)] relative z-10">
          <div className="mb-7 flex justify-center">
            <div className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 shadow-md ring-1 ring-slate-700/50">
              <Image
                src="/logos/logo.png"
                alt="Logo"
                width={128}
                height={36}
                className="h-8 w-auto object-contain"
                priority
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-[28px] font-bold text-slate-900 mb-1 leading-tight">Create your EVADA account</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Set up your workspace credentials to start secure testing operations.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="full-name" className="block text-xs font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="full-name"
                type="text"
                placeholder="John Doe"
                required
                className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-900 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-900 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="tenant-name" className="block text-xs font-medium text-gray-700 mb-1.5">
                Workspace Name <span className="text-red-500">*</span>
              </label>
              <input
                id="tenant-name"
                type="text"
                placeholder="Acme Security"
                className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-900 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  minLength={12}
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-900 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                Use 12+ characters with uppercase, lowercase, number, and special character.
              </p>
            </div>

            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/90 px-2 text-xs text-slate-500">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleSsoSignup("google")}
                className="w-full h-11 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.2 14.7 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.4S6.9 20.6 12 20.6c6.9 0 9.1-4.8 9.1-7.3 0-.5 0-.9-.1-1.3H12z" />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="text-center text-xs text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
