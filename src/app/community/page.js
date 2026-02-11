"use client";

import { COMMUNITY_POSTS } from "@/data/scenarios";

const typeColors = {
  Phone: "bg-gold-500/15 text-gold-500",
  Text: "bg-teal-500/15 text-teal-500",
  Email: "bg-purple-500/15 text-purple-400",
  Online: "bg-blue-500/15 text-blue-400",
};

export default function Community() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-200 mb-1">
            Community Alerts
          </h1>
          <p className="text-sm text-navy-500 font-sans">
            Central Florida &middot; Live feed
          </p>
        </div>
        <div className="px-4 py-2 rounded-full bg-danger-500/12 border border-danger-500/25 shrink-0">
          <span className="text-xs font-bold text-danger-500 font-sans">
            47 reports today
          </span>
        </div>
      </div>

      {/* Trending alert */}
      <div className="bg-gradient-to-r from-danger-500/12 to-danger-500/5 border border-danger-500/25 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] bg-danger-500 text-white px-2.5 py-0.5 rounded-full font-bold font-sans">
            TRENDING
          </span>
          <span className="text-xs text-danger-500 font-sans">
            Central Florida
          </span>
        </div>
        <div className="text-base font-bold text-navy-100 mb-1">
          FPL Scam Calls Surging This Week
        </div>
        <div className="text-sm text-navy-400 leading-relaxed">
          47 reports in the last 48 hours of callers posing as Florida Power &
          Light, threatening immediate shutoff and demanding gift card payment.
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {COMMUNITY_POSTS.map((post, i) => (
          <div
            key={i}
            className="bg-navy-900/70 rounded-2xl p-5 border border-teal-500/8"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-navy-400"
                  style={{
                    background: `hsl(${i * 60 + 180}, 30%, 20%)`,
                  }}
                >
                  {post.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-bold text-navy-200">
                    {post.user}
                  </div>
                  <div className="text-[11px] text-navy-500 font-sans">
                    {post.location} &middot; {post.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-md font-semibold font-sans ${typeColors[post.type] || "bg-navy-700 text-navy-400"}`}
                >
                  {post.type}
                </span>
                {post.verified && (
                  <span className="text-xs text-teal-500" title="Verified">
                    &#10003;
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-navy-400 leading-relaxed mb-3">
              {post.scam}
            </p>
            <div className="flex items-center gap-5 text-xs text-navy-500 font-sans">
              <button className="hover:text-navy-300 transition-colors cursor-pointer">
                &#9650; {post.votes}
              </button>
              <button className="hover:text-navy-300 transition-colors cursor-pointer">
                Reply
              </button>
              <button className="hover:text-navy-300 transition-colors cursor-pointer">
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report CTA */}
      <div className="text-center mt-6 p-6 bg-teal-500/6 rounded-2xl border border-dashed border-teal-500/20">
        <div className="text-sm text-navy-500 mb-3">
          Seen a scam? Help your community.
        </div>
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 text-sm font-bold font-sans cursor-pointer shadow-[0_4px_20px_rgba(46,196,182,0.3)] hover:shadow-[0_4px_28px_rgba(46,196,182,0.45)] transition-shadow">
          + Report a Scam
        </button>
      </div>
    </main>
  );
}
