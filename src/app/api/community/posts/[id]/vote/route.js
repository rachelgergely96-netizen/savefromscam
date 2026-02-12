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
 * POST /api/community/posts/:id/vote
 * Toggle vote on a post (add if not voted, remove if already voted)
 */
export async function POST(request, { params }) {
  try {
    const { id: postId } = params;

    // Authenticate user
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return Response.json(
        { error: "Please sign in to vote" },
        { status: 401 }
      );
    }

    const userClient = getSupabaseUserFromToken(accessToken);
    if (!userClient) {
      return Response.json(
        { error: "Please sign in to vote" },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { error: "Please sign in to vote" },
        { status: 401 }
      );
    }

    // Verify post exists and is approved
    const { data: post, error: postError } = await supabaseAdmin
      .from("community_posts")
      .select("id, status, vote_count")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.status !== "approved") {
      return Response.json(
        { error: "Cannot vote on pending or rejected posts" },
        { status: 403 }
      );
    }

    // Check if user already voted
    const { data: existingVote } = await supabaseAdmin
      .from("post_votes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingVote) {
      // Remove vote
      const { error: deleteError } = await supabaseAdmin
        .from("post_votes")
        .delete()
        .eq("id", existingVote.id);

      if (deleteError) {
        console.error("Error removing vote:", deleteError);
        return Response.json(
          { error: "Failed to remove vote" },
          { status: 500 }
        );
      }

      // Get updated vote count (trigger automatically updates it)
      const { data: updatedPost } = await supabaseAdmin
        .from("community_posts")
        .select("vote_count")
        .eq("id", postId)
        .single();

      return Response.json({
        voted: false,
        vote_count: updatedPost?.vote_count || post.vote_count - 1,
      });
    } else {
      // Add vote
      const { error: insertError } = await supabaseAdmin
        .from("post_votes")
        .insert({
          post_id: postId,
          user_id: user.id,
        });

      if (insertError) {
        console.error("Error adding vote:", insertError);
        return Response.json({ error: "Failed to add vote" }, { status: 500 });
      }

      // Get updated vote count (trigger automatically updates it)
      const { data: updatedPost } = await supabaseAdmin
        .from("community_posts")
        .select("vote_count")
        .eq("id", postId)
        .single();

      return Response.json({
        voted: true,
        vote_count: updatedPost?.vote_count || post.vote_count + 1,
      });
    }
  } catch (error) {
    console.error("Error in POST /api/community/posts/:id/vote:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
