"use client";
import React, { useEffect, useState } from "react";
import { onToast } from "@/lib/toast";

type ToastItem = { id: number; message: string; type: "success" | "error" | "info" };

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let id = 1;
    const unsub = onToast(({ message, type }) => {
      const item = { id: id++, message, type };
      setToasts((t) => [...t, item]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== item.id)), 4500);
    });
    return unsub;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-60 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-2 rounded shadow ${t.type === "success" ? "bg-emerald-600 text-white" : t.type === "error" ? "bg-red-600 text-white" : "bg-slate-800 text-white"}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
