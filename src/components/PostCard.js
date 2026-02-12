"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import CommentsSection from "@/components/CommentsSection";

const typeColors = {
  Phone: "bg-gold-500/15 text-gold-500",
  Text: "bg-teal-500/15 text-teal-500",
  Email: "bg-purple-500/15 text-purple-600",
  Online: "bg-blue-500/15 text-blue-600",
};

/**
 * Format timestamp as relative time (e.g., "2 hours ago")
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
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  } else {
    return "just now";
  }
}

export default function PostCard({ post, onVoteUpdate, index = 0 }) {
  const { user, session } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(post.user_voted);
  const [voteCount, setVoteCount] = useState(post.vote_count);

  async function handleVote() {
    if (!session) {
      alert("Please sign in to vote");
      return;
    }

    setVoting(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/vote`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setVoted(data.voted);
        setVoteCount(data.vote_count);

        // Notify parent component if callback provided
        if (onVoteUpdate) {
          onVoteUpdate(post.id, data.voted, data.vote_count);
        }
      } else {
        alert(data.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote");
    } finally {
      setVoting(false);
    }
  }

  return (
    <div className="card-flat rounded-2xl p-5 border border-sage-200 dark:border-dark-border hover:border-teal-500/30 dark:hover:border-dark-teal-primary/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white dark:text-dark-text-primary"
            style={{
              background: `hsl(${index * 60 + 180}, 30%, 20%)`,
            }}
          >
            {post.user.initials}
          </div>
          <div>
            <div className="text-sm font-bold text-navy-900 dark:text-dark-text-primary font-sans">
              {post.user.name}
            </div>
            <div className="text-[11px] text-navy-600 dark:text-dark-text-tertiary font-sans">
              {post.location || "Location not specified"} &middot;{" "}
              {formatTimeAgo(post.created_at)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-md font-semibold font-sans ${
              typeColors[post.scam_type] || "bg-navy-700 text-navy-400"
            }`}
          >
            {post.scam_type}
          </span>
          {post.verified && (
            <span
              className="text-xs text-teal-600 dark:text-dark-teal-primary"
              title="Verified"
            >
              &#10003;
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-navy-700 dark:text-dark-text-secondary leading-relaxed mb-3 font-sans whitespace-pre-wrap">
        {post.content}
      </p>

      <div className="flex items-center gap-5 text-xs text-navy-600 dark:text-dark-text-secondary font-sans">
        <button
          onClick={handleVote}
          disabled={voting}
          className={`hover:text-teal-600 dark:hover:text-dark-teal-primary transition-colors cursor-pointer disabled:opacity-50 ${
            voted
              ? "text-teal-600 dark:text-dark-teal-primary font-bold"
              : ""
          }`}
        >
          {voted ? "▲" : "△"} {voteCount}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-teal-600 dark:hover:text-dark-teal-primary transition-colors cursor-pointer"
        >
          Reply ({post.comment_count})
        </button>
        <button className="hover:text-teal-600 dark:hover:text-dark-teal-primary transition-colors cursor-pointer">
          Share
        </button>
      </div>

      {showComments && <CommentsSection postId={post.id} />}
    </div>
  );
}
