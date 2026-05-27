// ============================================================
// SuccessModal.jsx — Success popup after form submission
// ============================================================

import React, { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "../common/Common";

export default function SuccessModal({ branch, campaign, onClose }) {
  // Auto-close after 4 seconds
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Modal card */}
      <div className="
        animate-pop-in
        bg-white dark:bg-gray-900
        rounded-2xl shadow-card-lg
        p-8 max-w-md w-full text-center
        border border-gray-100 dark:border-gray-800
        relative
      ">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>

        {/* Content */}
        <h2 className="text-[20px] font-extrabold text-gray-900 dark:text-white mb-2">
          Activity Submitted!
        </h2>
        <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
          The retail activity report for{" "}
          <strong className="text-gray-800 dark:text-gray-200">{branch}</strong>
          {campaign && (
            <> — <em className="not-italic text-vivo-600">{campaign}</em></>
          )}{" "}
          has been saved successfully.
        </p>
        <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-3">
          📅 {new Date().toLocaleString("en-IN", {
            dateStyle: "medium", timeStyle: "short"
          })}
        </p>

        {/* Progress bar (auto-close indicator) */}
        <div className="mt-5 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ animation: "progressShrink 4s linear forwards" }}
          />
        </div>

        <Button variant="primary" className="mt-5 w-full justify-center" onClick={onClose}>
          ✓ Close
        </Button>
      </div>

      <style>{`
        @keyframes progressShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}
