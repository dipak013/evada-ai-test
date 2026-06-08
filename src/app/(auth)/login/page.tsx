"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UnifiedAPIService } from "@/services/unified-api.service";
import { buildSsoAuthorizeUrl, SsoProvider } from "@/services/sso.service";

// Helper function to get CSRF token from cookies
function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      // First, get CSRF token by hitting any safe endpoint or getting it from cookie
      // Django sets csrftoken cookie automatically
      // If no CSRF token, make a GET request to get one
      if (!getCookie('csrftoken')) {
        await UnifiedAPIService.auth.me().catch(() => {
          // Ignore error, we just want to get the CSRF cookie set
        });
      }
      
      // Prepare login data - backend expects email and password
      const loginData = { 
        email: email,
        password 
      };

      // Make the login request with CSRF token
      const response = await UnifiedAPIService.auth.login(loginData);
      const statusText = String(response.data?.status || "").toLowerCase();

      const loginOk = response.status >= 200 && response.status < 300
        && (!statusText || statusText === "ok" || statusText === "success" || statusText === "authenticated");

      if (loginOk) {
        globalThis.window.location.assign("/dashboard");
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.error || 
                            err.response.data?.detail || 
                            err.response.data?.message || 
                            "Invalid email or password";
        setError(errorMessage);
      } else if (err.request) {
        // Request made but no response
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        // Something else happened
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleSsoLogin = (provider: SsoProvider) => {
    setError("");
    try {
      globalThis.location.href = buildSsoAuthorizeUrl(provider, "login");
    } catch (err: any) {
      setError(err?.message || "SSO is not configured. Please contact administrator.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-100 via-indigo-100 to-slate-200 relative overflow-hidden">
      {/* Unified Decorative circles for entire background */}
      <div className="absolute top-10 right-20 w-32 h-32 md:w-64 md:h-64 bg-indigo-300 rounded-full opacity-25 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 md:w-80 md:h-80 bg-cyan-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-40 h-40 md:w-60 md:h-60 bg-sky-200 rounded-full opacity-15 blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-40 h-40 md:w-60 md:h-60 bg-indigo-200 rounded-full opacity-15 blur-3xl"></div>
      
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center relative p-4 md:p-8 z-10">
        <Link
          href="/#home"
          className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur hover:bg-white"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Home</span>
        </Link>
        <div className="bg-white/90 border border-slate-200/70 backdrop-blur-md w-full max-w-md mx-auto p-7 md:p-9 rounded-3xl shadow-[0_30px_70px_-28px_rgba(15,23,42,0.42)] relative z-10">
          {/* Logo */}
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

          {/* Welcome Text */}
          <div className="mb-6">
            <h2 className="text-[28px] font-bold text-slate-900 mb-1 leading-tight">
              Sign in to EVADA
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Access your security workspace and continue your assessments.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Client ID Field */}
            <div>
              <label htmlFor="client-id" className="block text-xs font-medium text-gray-700 mb-1.5">
                Client ID<span className="text-red-500">*</span>
              </label>
              <input
                id="client-id"
                type="email"
                placeholder="helloexample@gmail.com"
                className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-900 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* User ID Field */}
            <div>
              <label htmlFor="user-id" className="block text-xs font-medium text-gray-700 mb-1.5">
                User ID <span className="text-red-500">*</span>
              </label>
              <input
                id="user-id"
                type="text"
                placeholder="hello@123"
                className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-900 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
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
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/90 px-2 text-xs text-slate-500">or sign in with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleSsoLogin("google")}
                className="w-full h-11 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.2 14.7 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.4S6.9 20.6 12 20.6c6.9 0 9.1-4.8 9.1-7.3 0-.5 0-.9-.1-1.3H12z" />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-xs text-slate-600">
              Need access?{" "}
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Create Account
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Right Side - Tier Information */}
      <div className="hidden lg:flex w-1/2 h-screen items-center justify-center relative z-10 pl-8 pr-4">
        {/* Tier Cards Container */}
        <div className="relative z-10 w-full">
          {/* Premium Header */}
          <div className="text-center mb-6">
            <div className="inline-block mb-3">
              <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-md border border-indigo-300/50 rounded-full shadow-lg shadow-indigo-500/20">
                <div className="relative">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-indigo-700 text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">Security Tiers</span>
              </div>
            </div>
            {/* <h2 className="text-2xl md:text-3xl font-extrabold mb-2 bg-gradient-to-r from-gray-800 via-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Choose Your Protection
            </h2> */}
            {/* <p className="text-gray-600 text-xs font-semibold max-w-md mx-auto">
              Enterprise-grade penetration testing solutions
            </p> */}
          </div>

          {/* Premium Tier Cards */}
          <div className="space-y-3.5">
            {/* Tier 1: Radar Scan */}
            <div className="group relative bg-white rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-cyan-100/50 hover:border-cyan-300/50 overflow-hidden">
              {/* Colored accent border on left */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 via-cyan-500 to-blue-600 rounded-l-xl group-hover:w-2 transition-all"></div>
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-start gap-3 pl-2">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-cyan-400/40 rounded-lg blur-md group-hover:blur-lg transition-all"></div>
                  <div className="relative bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 rounded-lg p-2.5 shadow-xl shadow-cyan-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-lg font-extrabold text-gray-900">
                      Tier 1: Radar Scan
                    </h3>
                    <div className="px-2.5 py-0.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 rounded-md text-white text-[9px] font-black uppercase tracking-wider shadow-lg shadow-cyan-500/40 animate-pulse">CORE</div>
                  </div>
                  <p className="text-cyan-700 text-xs font-bold mb-2.5 tracking-wide">
                    Focus: Continuous Discovery & Network Reconnaissance
                  </p>
                  <p className="text-gray-700 text-xs leading-relaxed mb-2 font-medium">
                    <span className="font-bold text-gray-900">Best for:</span> External attack surface management and 24/7 network & port scanning to find "shadow IT."
                  </p>
                  <p className="text-gray-600 text-xs italic flex items-center gap-1.5 font-medium">
                    <svg className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    See exactly what a hacker sees from the outside
                  </p>
                </div>
              </div>
            </div>

            {/* Tier 2: Deep Shield */}
            <div className="group relative bg-white rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100/50 hover:border-purple-300/50 overflow-hidden">
              {/* Colored accent border on left */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-400 via-purple-500 to-indigo-600 rounded-l-xl group-hover:w-2 transition-all"></div>
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-start gap-3 pl-2">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-purple-400/40 rounded-lg blur-md group-hover:blur-lg transition-all"></div>
                  <div className="relative bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 rounded-lg p-2.5 shadow-xl shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-lg font-extrabold text-gray-900">
                      Tier 2: Deep Shield
                    </h3>
                    <div className="px-2.5 py-0.5 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 rounded-md text-white text-[9px] font-black uppercase tracking-wider shadow-lg shadow-purple-500/40 animate-pulse">PRO</div>
                  </div>
                  <p className="text-purple-700 text-xs font-bold mb-2.5 tracking-wide">
                    Focus: Advanced Vulnerability Management & Agent-Based Intel
                  </p>
                  <p className="text-gray-700 text-xs leading-relaxed mb-2 font-medium">
                    <span className="font-bold text-gray-900">Best for:</span> Comprehensive internal network scanning via downloadable agents and full CVE assessment.
                  </p>
                  <p className="text-gray-600 text-xs flex items-center gap-1.5 font-medium">
                    <svg className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All Radar Scan features
                  </p>
                </div>
              </div>
            </div>

            {/* Tier 3: Exploit Scan */}
            <div className="group relative bg-white rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-orange-100/50 hover:border-orange-300/50 overflow-hidden">
              {/* Colored accent border on left */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 via-orange-500 to-red-600 rounded-l-xl group-hover:w-2 transition-all"></div>
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-start gap-3 pl-2">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-orange-400/40 rounded-lg blur-md group-hover:blur-lg transition-all"></div>
                  <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 rounded-lg p-2.5 shadow-xl shadow-orange-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-lg font-extrabold text-gray-900">
                      Tier 3: Exploit Scan
                    </h3>
                    <div className="px-2.5 py-0.5 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 rounded-md text-white text-[9px] font-black uppercase tracking-wider shadow-lg shadow-orange-500/40 animate-pulse">ELITE</div>
                  </div>
                  <p className="text-orange-700 text-xs font-bold mb-2.5 tracking-wide">
                    Focus: Automated Exploit Validation & Sandbox Testing
                  </p>
                  <p className="text-gray-700 text-xs leading-relaxed mb-2 font-medium">
                    <span className="font-bold text-gray-900">Best for:</span> Proving risk through safe exploitation in Sandbox/Dev environments to eliminate false positives.
                  </p>
                  <p className="text-gray-600 text-xs flex items-center gap-1.5 font-medium">
                    <svg className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All Deep Shield features
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-md border border-indigo-200/50 rounded-lg shadow-lg shadow-indigo-500/10">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-gray-700 text-[10px] font-bold">
                Enterprise-grade security solutions tailored to your needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
