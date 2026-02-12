"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { US_STATES, STATE_CODE_MAP } from "@/data/us-states";
import PostCard from "@/components/PostCard";
import NewPostModal from "@/components/NewPostModal";

function getInitialState(searchParams) {
  // URL param takes priority (for shareable links)
  const urlState = searchParams?.get("state");
  if (urlState && STATE_CODE_MAP[urlState]) return urlState;

  // Then localStorage
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("savefromscam_state");
      if (saved && STATE_CODE_MAP[saved]) return saved;
    } catch {}
  }

  return "FL";
}

function CommunityContent() {
  const { session } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedState, setSelectedState] = useState(() =>
    getInitialState(searchParams)
  );
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [trending, setTrending] = useState(null);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {};

      const res = await fetch(
        `/api/community/posts?limit=20&state=${selectedState}`,
        { headers }
      );
      const data = await res.json();

      if (res.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.error || "Failed to load posts");
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError("Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [session, selectedState]);

  const fetchTrending = useCallback(async () => {
    setTrendingLoading(true);
    try {
      const res = await fetch(
        `/api/community/trending?state=${selectedState}`
      );
      const data = await res.json();
      setTrending(data.trending || null);
    } catch (err) {
      console.error("Failed to load trending:", err);
      setTrending(null);
    } finally {
      setTrendingLoading(false);
    }
  }, [selectedState]);

  useEffect(() => {
    fetchPosts();
    fetchTrending();
  }, [fetchPosts, fetchTrending]);

  function handleStateChange(e) {
    const newState = e.target.value;
    setSelectedState(newState);

    // Save to localStorage
    try {
      localStorage.setItem("savefromscam_state", newState);
    } catch {}

    // Update URL without full navigation
    router.replace(`/community?state=${newState}`, { scroll: false });
  }

  function handleNewPost() {
    fetchPosts();
    fetchTrending();
  }

  function handleVoteUpdate(postId, voted, voteCount) {
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
      window.location.href = "/auth";
      return;
    }
    setShowNewPostModal(true);
  }

  const scamTypeLabels = {
    Phone: "Phone Call Scams",
    Text: "Text Message Scams",
    Email: "Email Scams",
    Online: "Online/Social Media Scams",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 dark:text-dark-text-primary mb-1 font-sans">
            Community Alerts
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-navy-600 dark:text-dark-text-secondary font-sans">
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="bg-transparent text-sm font-semibold text-navy-900 dark:text-dark-text-primary border-none outline-none cursor-pointer p-0 pr-5 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M3 5l3 3 3-3'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right center",
              }}
            >
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
            <span>&middot; Live feed</span>
          </div>
        </div>
        <div className="px-4 py-2 rounded-full bg-danger-500/12 dark:bg-dark-danger-bg border border-danger-500/25 dark:border-dark-danger/30 shrink-0">
          <span className="text-xs font-bold text-danger-500 dark:text-dark-danger font-sans">
            {posts.length} reports
          </span>
        </div>
      </div>

      {/* Trending alert */}
      {trendingLoading ? (
        <div className="bg-gradient-to-r from-danger-500/12 to-danger-500/5 dark:from-dark-danger-bg dark:to-dark-danger-bg/50 border border-danger-500/25 dark:border-dark-danger/30 rounded-2xl p-5 mb-6 animate-pulse">
          <div className="h-4 bg-danger-500/10 dark:bg-dark-danger/10 rounded w-32 mb-2" />
          <div className="h-5 bg-danger-500/10 dark:bg-dark-danger/10 rounded w-3/4 mb-1" />
          <div className="h-4 bg-danger-500/10 dark:bg-dark-danger/10 rounded w-full" />
        </div>
      ) : trending ? (
        <div className="bg-gradient-to-r from-danger-500/12 to-danger-500/5 dark:from-dark-danger-bg dark:to-dark-danger-bg/50 border border-danger-500/25 dark:border-dark-danger/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-danger-500 dark:bg-dark-danger text-white px-2.5 py-0.5 rounded-full font-bold font-sans">
              TRENDING
            </span>
            <span className="text-xs text-danger-500 dark:text-dark-danger font-sans">
              {trending.is_fallback ? "Nationwide" : trending.state_name}
            </span>
          </div>
          <div className="text-base font-bold text-navy-900 dark:text-dark-text-primary mb-1 font-sans">
            {scamTypeLabels[trending.scam_type] || trending.scam_type} Surging
          </div>
          <div className="text-sm text-navy-700 dark:text-dark-text-secondary leading-relaxed font-sans">
            {trending.count} report{trending.count !== 1 ? "s" : ""} in the last
            48 hours
            {trending.is_fallback
              ? " nationwide"
              : ` in ${trending.state_name}`}
            .
          </div>
        </div>
      ) : null}

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
                No posts yet in {STATE_CODE_MAP[selectedState]}. Be the first to
                report a scam!
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
        defaultState={selectedState}
      />
    </main>
  );
}

export default function Community() {
  return (
    <Suspense
      fallback={
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center py-12">
            <div className="text-navy-600 dark:text-dark-text-secondary">
              Loading...
            </div>
          </div>
        </main>
      }
    >
      <CommunityContent />
    </Suspense>
  );
}
