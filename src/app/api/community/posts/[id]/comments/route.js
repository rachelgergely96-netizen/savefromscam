import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

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
 * GET /api/community/posts/:id/comments
 * Fetch approved comments for a post
 * Query params: limit, offset
 */
export async function GET(request, { params }) {
  try {
    const { id: postId } = params;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Verify post exists
    const { data: post } = await supabaseAdmin
      .from("community_posts")
      .select("id, status")
      .eq("id", postId)
      .single();

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch approved comments
    const { data: comments, error, count } = await supabaseAdmin
      .from("post_comments")
      .select(
        `
        id,
        user_id,
        content,
        created_at
      `,
        { count: "exact" }
      )
      .eq("post_id", postId)
      .eq("status", "approved")
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching comments:", error);
      return Response.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      );
    }

    // Get user info for each comment
    const userIds = [...new Set(comments.map((c) => c.user_id))];
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);

    // Create user lookup map
    const userMap = {};
    profiles?.forEach((profile) => {
      userMap[profile.id] = profile;
    });

    // Format response
    const formattedComments = comments.map((comment) => {
      const profile = userMap[comment.user_id];
      const userName = profile?.full_name || profile?.email?.split("@")[0] || "Anonymous";
      const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return {
        id: comment.id,
        user: {
          id: comment.user_id,
          name: userName,
          initials: initials,
        },
        content: comment.content,
        created_at: comment.created_at,
      };
    });

    return Response.json({
      comments: formattedComments,
      total: count || 0,
      has_more: count > offset + limit,
    });
  } catch (error) {
    console.error("Error in GET /api/community/posts/:id/comments:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/community/posts/:id/comments
 * Add a comment to a post
 */
export async function POST(request, { params }) {
  try {
    const { id: postId } = params;

    // Authenticate user
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return Response.json(
        { error: "Please sign in to comment" },
        { status: 401 }
      );
    }

    const userClient = getSupabaseUserFromToken(accessToken);
    if (!userClient) {
      return Response.json(
        { error: "Please sign in to comment" },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { error: "Please sign in to comment" },
        { status: 401 }
      );
    }

    // Verify post exists and is approved
    const { data: post, error: postError } = await supabaseAdmin
      .from("community_posts")
      .select("id, status")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.status !== "approved") {
      return Response.json(
        { error: "Cannot comment on pending or rejected posts" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { content } = body;

    // Validate content
    const trimmedContent = content?.trim();
    if (!trimmedContent || trimmedContent.length < 1 || trimmedContent.length > 1000) {
      return Response.json(
        { error: "Comment must be between 1 and 1000 characters" },
        { status: 400 }
      );
    }

    // Insert comment with pending status
    const { data: newComment, error: insertError } = await supabaseAdmin
      .from("post_comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: trimmedContent,
        status: "pending", // Goes to moderation queue
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Error inserting comment:", insertError);
      return Response.json(
        { error: "Failed to create comment" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        id: newComment.id,
        status: "pending",
        message: "Comment submitted for review.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/community/posts/:id/comments:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
