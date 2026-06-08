"use client";
import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UnifiedAPIService } from "@/services/unified-api.service";

function CallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = params.get("code");
    const state = (params.get("state") || "").trim();

    const [providerRaw, intentRaw] = state.includes(":") ? state.split(":", 2) : ["", ""];
    const provider = (providerRaw || "").toLowerCase();
    const intent = (intentRaw || "login").toLowerCase();

    const payload: { code: string; provider?: "google" | "microsoft"; intent?: "login" | "signup" } = { code } as any;
    if (provider === "google" || provider === "microsoft") {
        payload.provider = provider;
        payload.intent = intent === "signup" ? "signup" : "login";
    }

    if (code) {
      UnifiedAPIService.auth
        .oauthExchange(payload)
        .then(() => {
          router.push("/dashboard");
        })
        .catch((err) => {
          const message = err?.response?.data?.error || "OAuth exchange failed";
          setError(message);
          console.error("OAuth exchange failed", err?.response?.data || err);
        });
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold mb-1">SSO Sign-in Failed</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return <div>Signing you in...</div>;
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}