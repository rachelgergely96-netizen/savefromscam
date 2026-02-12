"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function NewPostModal({ open, onClose, onSubmit }) {
  const { session } = useAuth();
  const [scamType, setScamType] = useState("Phone");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          scam_type: scamType,
          content: content.trim(),
          location: location.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit post");
      }

      // Success - show confirmation
      setSuccess(true);
      setContent("");
      setLocation("");
      setScamType("Phone");

      // Call onSubmit callback
      if (onSubmit) {
        onSubmit();
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-dark-text-primary mb-2">
              Post Submitted!
            </h2>
            <p className="text-sm text-navy-600 dark:text-dark-text-secondary">
              Your scam report is being reviewed by our AI moderator. You'll see it in the feed within a few minutes.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-navy-900 dark:text-dark-text-primary">
                Report a Scam
              </h2>
              <button
                onClick={onClose}
                className="text-navy-600 dark:text-dark-text-secondary hover:text-navy-900 dark:hover:text-dark-text-primary text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-navy-900 dark:text-dark-text-primary mb-2">
                  Scam Type
                </label>
                <select
                  value={scamType}
                  onChange={(e) => setScamType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-navy-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-dark-teal-primary"
                  required
                >
                  <option value="Phone">Phone Call</option>
                  <option value="Text">Text Message</option>
                  <option value="Email">Email</option>
                  <option value="Online">Online/Social Media</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-navy-900 dark:text-dark-text-primary mb-2">
                  What happened?
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe the scam attempt. Include details that would help others recognize it, like what the scammer said, what they asked for, or any red flags you noticed."
                  rows={6}
                  minLength={20}
                  maxLength={2000}
                  className="w-full px-4 py-2 rounded-lg border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-navy-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-dark-teal-primary resize-none"
                  required
                />
                <div className="text-xs text-navy-600 dark:text-dark-text-tertiary mt-1">
                  {content.length}/2000 characters (minimum 20)
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-navy-900 dark:text-dark-text-primary mb-2">
                  Location <span className="font-normal text-navy-600 dark:text-dark-text-secondary">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Orlando, FL"
                  maxLength={100}
                  className="w-full px-4 py-2 rounded-lg border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-navy-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-dark-teal-primary"
                />
              </div>

              {error && (
                <div className="mb-4 bg-danger-500/10 dark:bg-dark-danger-bg border border-danger-500/25 dark:border-dark-danger/30 text-danger-500 dark:text-dark-danger px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-sage-200 dark:border-dark-border text-navy-900 dark:text-dark-text-primary font-bold hover:bg-sage-50 dark:hover:bg-dark-bg-tertiary transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || content.trim().length < 20}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 dark:from-dark-teal-primary dark:to-dark-teal-hover text-navy-950 dark:text-dark-bg-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>

              <div className="mt-4 text-xs text-navy-600 dark:text-dark-text-secondary">
                Your post will be reviewed by our AI moderator before appearing publicly. This usually takes just a few minutes.
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
