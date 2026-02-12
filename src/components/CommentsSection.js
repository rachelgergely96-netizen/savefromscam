"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";

/**
 * Format timestamp as relative time
 */
function formatTimeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMins > 0) {
    return `${diffMins}m ago`;
  } else {
    return "just now";
  }
}

export default function CommentsSection({ postId }) {
  const { session } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    try {
      const headers = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {};

      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        headers,
      });
      const data = await res.json();

      if (res.ok) {
        setComments(data.comments || []);
      } else {
        console.error("Failed to load comments:", data.error);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session) {
      alert("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setNewComment("");
        setPendingMessage(true);
        setTimeout(() => setPendingMessage(false), 5000);
        // Optionally refresh comments after a delay
        setTimeout(() => fetchComments(), 1000);
      } else {
        setError(data.error || "Failed to post comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4 pl-4 border-l-2 border-teal-500 dark:border-dark-teal-primary">
      {loading ? (
        <div className="text-xs text-navy-600 dark:text-dark-text-secondary">
          Loading comments...
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3 mb-3">
          {comments.map((comment) => (
            <div key={comment.id}>
              <div className="flex gap-2 items-center mb-1">
                <span className="font-semibold text-sm text-navy-900 dark:text-dark-text-primary">
                  {comment.user.name}
                </span>
                <span className="text-xs text-navy-600 dark:text-dark-text-tertiary">
                  {formatTimeAgo(comment.created_at)}
                </span>
              </div>
              <p className="text-sm text-navy-700 dark:text-dark-text-secondary whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-navy-600 dark:text-dark-text-secondary mb-3">
          No comments yet. Be the first to comment!
        </div>
      )}

      {session ? (
        <form onSubmit={handleSubmit} className="mt-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            maxLength={1000}
            className="w-full border border-sage-200 dark:border-dark-border rounded-lg p-2 text-sm bg-white dark:bg-dark-bg-primary text-navy-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-dark-teal-primary resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-navy-600 dark:text-dark-text-tertiary">
              {newComment.length}/1000
            </div>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="text-sm px-4 py-1 bg-teal-500 dark:bg-dark-teal-primary text-white dark:text-dark-bg-primary rounded-lg hover:bg-teal-600 dark:hover:bg-dark-teal-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
          {error && (
            <div className="mt-2 text-xs text-danger-500 dark:text-dark-danger">
              {error}
            </div>
          )}
          {pendingMessage && (
            <div className="mt-2 text-xs text-teal-600 dark:text-dark-teal-primary">
              Comment submitted for review!
            </div>
          )}
        </form>
      ) : (
        <div className="text-xs text-navy-600 dark:text-dark-text-secondary mt-3">
          <a
            href="/auth"
            className="text-teal-600 dark:text-dark-teal-primary hover:underline"
          >
            Sign in
          </a>{" "}
          to comment
        </div>
      )}
    </div>
  );
}
