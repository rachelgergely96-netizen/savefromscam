import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { VALID_STATE_CODES, STATE_CODE_MAP } from "@/data/us-states";

export const runtime = "nodejs";

/**
 * GET /api/community/trending?state=FL
 * Returns the most-reported scam type for a state in the last 48 hours
 * Falls back to nationwide if no data for the given state
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");

    if (!state || !VALID_STATE_CODES.has(state)) {
      return Response.json(
        { error: "Valid state parameter required" },
        { status: 400 }
      );
    }

    const fortyEightHoursAgo = new Date(
      Date.now() - 48 * 60 * 60 * 1000
    ).toISOString();

    // Query approved posts for this state in last 48 hours
    const { data: recentPosts, error } = await supabaseAdmin
      .from("community_posts")
      .select("scam_type")
      .eq("status", "approved")
      .eq("state", state)
      .gte("created_at", fortyEightHoursAgo);

    if (error) {
      console.error("Error fetching trending data:", error);
      return Response.json(
        { error: "Failed to fetch trending data" },
        { status: 500 }
      );
    }

    // Aggregate by scam_type
    let topType = null;
    let topCount = 0;

    if (recentPosts && recentPosts.length > 0) {
      const counts = {};
      recentPosts.forEach((post) => {
        counts[post.scam_type] = (counts[post.scam_type] || 0) + 1;
      });

      for (const [type, count] of Object.entries(counts)) {
        if (count > topCount) {
          topType = type;
          topCount = count;
        }
      }

      return Response.json({
        trending: {
          scam_type: topType,
          count: topCount,
          state: state,
          state_name: STATE_CODE_MAP[state],
          is_fallback: false,
        },
      });
    }

    // Fallback: try nationwide
    const { data: nationwidePosts } = await supabaseAdmin
      .from("community_posts")
      .select("scam_type")
      .eq("status", "approved")
      .gte("created_at", fortyEightHoursAgo);

    if (nationwidePosts && nationwidePosts.length > 0) {
      const counts = {};
      nationwidePosts.forEach((post) => {
        counts[post.scam_type] = (counts[post.scam_type] || 0) + 1;
      });

      for (const [type, count] of Object.entries(counts)) {
        if (count > topCount) {
          topType = type;
          topCount = count;
        }
      }

      if (topType) {
        return Response.json({
          trending: {
            scam_type: topType,
            count: topCount,
            state: null,
            state_name: "Nationwide",
            is_fallback: true,
          },
        });
      }
    }

    // No data at all
    return Response.json({ trending: null });
  } catch (error) {
    console.error("Error in GET /api/community/trending:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
