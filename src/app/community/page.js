"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { COMMUNITY_POSTS } from "@/data/scenarios";
import PostCard from "@/components/PostCard";
import NewPostModal from "@/components/NewPostModal";

export default function Community() {
  const { session } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [session]);

  async function fetchPosts() {
    try {
      const headers = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {};

      const res = await fetch("/api/community/posts?limit=20", { headers });
      const data = await res.json();

      if (res.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.error || "Failed to load posts");
        // Fallback to hardcoded posts if API fails
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError("Failed to load posts");
      // Fallback to empty array
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleNewPost() {
    // Refresh posts after new post is submitted
    fetchPosts();
  }

  function handleVoteUpdate(postId, voted, voteCount) {
    // Update the post in the local state
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, user_voted: voted, vote_count: voteCount }
          : post
      )
    );
  }

  function handleReportClick() {
    if (!session) {
      // Redirect to sign in
      window.location.href = "/auth";
      return;
    }
    setShowNewPostModal(true);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 dark:text-dark-text-primary mb-1 font-sans">
            Community Alerts
          </h1>
          <p className="text-sm text-navy-600 dark:text-dark-text-secondary font-sans">
            Central Florida &middot; Live feed
          </p>
        </div>
        <div className="px-4 py-2 rounded-full bg-danger-500/12 dark:bg-dark-danger-bg border border-danger-500/25 dark:border-dark-danger/30 shrink-0">
          <span className="text-xs font-bold text-danger-500 dark:text-dark-danger font-sans">
            {posts.length} reports
          </span>
        </div>
      </div>

      {/* Trending alert */}
      <div className="bg-gradient-to-r from-danger-500/12 to-danger-500/5 dark:from-dark-danger-bg dark:to-dark-danger-bg/50 border border-danger-500/25 dark:border-dark-danger/30 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] bg-danger-500 dark:bg-dark-danger text-white px-2.5 py-0.5 rounded-full font-bold font-sans">
            TRENDING
          </span>
          <span className="text-xs text-danger-500 dark:text-dark-danger font-sans">
            Central Florida
          </span>
        </div>
        <div className="text-base font-bold text-navy-900 dark:text-dark-text-primary mb-1 font-sans">
          FPL Scam Calls Surging This Week
        </div>
        <div className="text-sm text-navy-700 dark:text-dark-text-secondary leading-relaxed font-sans">
          47 reports in the last 48 hours of callers posing as Florida Power &
          Light, threatening immediate shutoff and demanding gift card payment.
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-navy-600 dark:text-dark-text-secondary">
            Loading community posts...
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-danger-500 dark:text-dark-danger mb-4">
            {error}
          </div>
          <div className="text-sm text-navy-600 dark:text-dark-text-secondary">
            Showing example posts instead
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {posts.length > 0 ? (
          posts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              onVoteUpdate={handleVoteUpdate}
              index={i}
            />
          ))
        ) : (
          !loading && (
            <div className="text-center py-12">
              <div className="text-navy-600 dark:text-dark-text-secondary mb-4">
                No posts yet. Be the first to report a scam!
              </div>
              <button
                onClick={handleReportClick}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 dark:from-dark-teal-primary dark:to-dark-teal-hover text-navy-950 dark:text-dark-bg-primary text-sm font-bold font-sans cursor-pointer shadow-[0_4px_20px_rgba(46,196,182,0.3)] hover:shadow-[0_4px_28px_rgba(46,196,182,0.45)] transition-shadow"
              >
                + Report a Scam
              </button>
            </div>
          )
        )}
      </div>

      {/* Report CTA */}
      {posts.length > 0 && (
        <div className="text-center mt-6 p-6 bg-teal-500/6 dark:bg-dark-teal-bg rounded-2xl border border-dashed border-teal-500/20 dark:border-dark-teal-primary/30">
          <div className="text-sm text-navy-700 dark:text-dark-text-secondary mb-3 font-sans">
            Seen a scam? Help your community.
          </div>
          <button
            onClick={handleReportClick}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 dark:from-dark-teal-primary dark:to-dark-teal-hover text-navy-950 dark:text-dark-bg-primary text-sm font-bold font-sans cursor-pointer shadow-[0_4px_20px_rgba(46,196,182,0.3)] hover:shadow-[0_4px_28px_rgba(46,196,182,0.45)] transition-shadow"
          >
            + Report a Scam
          </button>
        </div>
      )}

      {/* New Post Modal */}
      <NewPostModal
        open={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        onSubmit={handleNewPost}
      />
    </main>
  );
}
