"use client";
import React from "react";

type Props = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ isOpen, title = "Confirm", description, confirmLabel = "Confirm", cancelLabel = "Cancel", loading = false, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
      <div className="bg-white rounded shadow-lg p-4 w-[420px] max-w-full z-80">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description ? <div className="text-sm text-gray-600 mb-4">{description}</div> : null}
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 border rounded" disabled={loading}>{cancelLabel}</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-indigo-600 text-white rounded flex items-center gap-2" disabled={loading}>
            {loading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
