import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { VALID_STATE_CODES } from "@/data/us-states";

export const runtime = "nodejs";

const FREE_POSTS_PER_DAY = 3;

/**
 * Get Supabase client from access token
 */
function getSupabaseUserFromToken(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !accessToken) return null;
  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false },
  });
  return userClient;
}

/**
 * GET /api/community/posts
 * Fetch approved posts with pagination
 * Query params: limit, offset, scam_type, state
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");
    const scamType = searchParams.get("scam_type");
    const state = searchParams.get("state");

    // Get user if authenticated (to check if they voted)
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();
    let currentUserId = null;

    if (accessToken) {
      const userClient = getSupabaseUserFromToken(accessToken);
      if (userClient) {
        const {
          data: { user },
        } = await userClient.auth.getUser();
        currentUserId = user?.id;
      }
    }

    // Build query
    let query = supabaseAdmin
      .from("community_posts")
      .select(
        `
        id,
        user_id,
        scam_type,
        content,
        location,
        state,
        vote_count,
        comment_count,
        verified,
        created_at
      `,
        { count: "exact" }
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by scam type if specified
    if (scamType && ["Phone", "Text", "Email", "Online"].includes(scamType)) {
      query = query.eq("scam_type", scamType);
    }

    // Filter by state if specified
    if (state && VALID_STATE_CODES.has(state)) {
      query = query.eq("state", state);
    }

    const { data: posts, error, count } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
      return Response.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    // Get user info for each post
    const userIds = [...new Set(posts.map((p) => p.user_id))];
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);

    // Create user lookup map
    const userMap = {};
    profiles?.forEach((profile) => {
      userMap[profile.id] = profile;
    });

    // Check if current user voted on these posts
    let userVotes = new Set();
    if (currentUserId) {
      const { data: votes } = await supabaseAdmin
        .from("post_votes")
        .select("post_id")
        .eq("user_id", currentUserId)
        .in(
          "post_id",
          posts.map((p) => p.id)
        );
      userVotes = new Set(votes?.map((v) => v.post_id) || []);
    }

    // Format response
    const formattedPosts = posts.map((post) => {
      const profile = userMap[post.user_id];
      const userName = profile?.full_name || profile?.email?.split("@")[0] || "Anonymous";
      const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return {
        id: post.id,
        user: {
          id: post.user_id,
          name: userName,
          initials: initials,
        },
        scam_type: post.scam_type,
        content: post.content,
        location: post.location,
        state: post.state,
        vote_count: post.vote_count,
        comment_count: post.comment_count,
        verified: post.verified,
        created_at: post.created_at,
        user_voted: userVotes.has(post.id),
      };
    });

    return Response.json({
      posts: formattedPosts,
      total: count || 0,
      has_more: count > offset + limit,
    });
  } catch (error) {
    console.error("Error in GET /api/community/posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/community/posts
 * Submit a new scam report
 */
export async function POST(request) {
  try {
    // Authenticate user
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return Response.json(
        { error: "Please sign in to submit a post" },
        { status: 401 }
      );
    }

    const userClient = getSupabaseUserFromToken(accessToken);
    if (!userClient) {
      return Response.json(
        { error: "Please sign in to submit a post" },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { error: "Please sign in to submit a post" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { scam_type, content, location, state } = body;

    // Validate scam_type
    const validScamTypes = ["Phone", "Text", "Email", "Online"];
    if (!scam_type || !validScamTypes.includes(scam_type)) {
      return Response.json(
        { error: "Invalid scam type. Must be Phone, Text, Email, or Online" },
        { status: 400 }
      );
    }

    // Validate state (required)
    if (!state || !VALID_STATE_CODES.has(state)) {
      return Response.json(
        { error: "Please select a valid US state" },
        { status: 400 }
      );
    }

    // Validate content
    const trimmedContent = content?.trim();
    if (!trimmedContent || trimmedContent.length < 20 || trimmedContent.length > 2000) {
      return Response.json(
        { error: "Content must be between 20 and 2000 characters" },
        { status: 400 }
      );
    }

    // Validate location if provided
    if (location && location.length > 100) {
      return Response.json(
        { error: "Location must be 100 characters or less" },
        { status: 400 }
      );
    }

    // Check rate limits
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_pro")
      .eq("id", user.id)
      .single();

    const isPro = !!profile?.is_pro;

    // Rate limiting for free users
    if (!isPro) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: rateLimit } = await supabaseAdmin
        .from("post_rate_limits")
        .select("posts_today, reset_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (rateLimit) {
        const resetDate = new Date(rateLimit.reset_at).toISOString().slice(0, 10);

        if (resetDate >= today) {
          // Same day, check limit
          if (rateLimit.posts_today >= FREE_POSTS_PER_DAY) {
            return Response.json(
              {
                error: `You've reached your daily post limit (${FREE_POSTS_PER_DAY}). Upgrade to Premium for unlimited posts.`,
                limitReached: true,
              },
              { status: 403 }
            );
          }

          // Increment counter
          await supabaseAdmin
            .from("post_rate_limits")
            .update({ posts_today: rateLimit.posts_today + 1 })
            .eq("user_id", user.id);
        } else {
          // New day, reset counter
          await supabaseAdmin
            .from("post_rate_limits")
            .upsert({
              user_id: user.id,
              posts_today: 1,
              reset_at: new Date().toISOString(),
            });
        }
      } else {
        // First post ever, create rate limit record
        await supabaseAdmin.from("post_rate_limits").insert({
          user_id: user.id,
          posts_today: 1,
          reset_at: new Date().toISOString(),
        });
      }
    }

    // Insert post with pending status
    const { data: newPost, error: insertError } = await supabaseAdmin
      .from("community_posts")
      .insert({
        user_id: user.id,
        scam_type: scam_type,
        content: trimmedContent,
        state: state,
        location: location?.trim() || null,
        status: "pending", // Goes to moderation queue
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Error inserting post:", insertError);
      return Response.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        id: newPost.id,
        status: "pending",
        message: "Post submitted for review. You'll be notified when it's approved.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/community/posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
