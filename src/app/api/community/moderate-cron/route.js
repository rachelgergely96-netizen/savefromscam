import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { moderatePost, moderateComment } from "@/lib/moderateContent";

export const runtime = "nodejs";

/**
 * GET /api/community/moderate-cron
 * Process pending posts and comments through AI moderation
 * Triggered by Vercel cron job every 5 minutes
 */
export async function GET(request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = {
      posts_processed: 0,
      posts_approved: 0,
      posts_rejected: 0,
      comments_processed: 0,
      comments_approved: 0,
      comments_rejected: 0,
      errors: [],
    };

    // ===== MODERATE PENDING POSTS =====
    const { data: pendingPosts, error: postsError } = await supabaseAdmin
      .from("community_posts")
      .select("id, user_id, scam_type, content")
      .eq("status", "pending")
      .is("moderation_score", null)
      .limit(10); // Process in batches

    if (postsError) {
      console.error("Error fetching pending posts:", postsError);
      results.errors.push(`Posts fetch error: ${postsError.message}`);
    } else if (pendingPosts && pendingPosts.length > 0) {
      for (const post of pendingPosts) {
        try {
          // Run AI moderation
          const moderationResult = await moderatePost({
            content: post.content,
            scam_type: post.scam_type,
          });

          // Update post with moderation result
          const { error: updateError } = await supabaseAdmin
            .from("community_posts")
            .update({
              status: moderationResult.approved ? "approved" : "rejected",
              moderation_score: moderationResult.score,
              moderation_reason: moderationResult.reason,
              moderated_at: new Date().toISOString(),
            })
            .eq("id", post.id);

          if (updateError) {
            console.error(`Error updating post ${post.id}:`, updateError);
            results.errors.push(`Post ${post.id} update error: ${updateError.message}`);
          } else {
            results.posts_processed++;
            if (moderationResult.approved) {
              results.posts_approved++;
            } else {
              results.posts_rejected++;
            }
          }
        } catch (error) {
          console.error(`Error moderating post ${post.id}:`, error);
          results.errors.push(`Post ${post.id} moderation error: ${error.message}`);
        }
      }
    }

    // ===== MODERATE PENDING COMMENTS =====
    const { data: pendingComments, error: commentsError } = await supabaseAdmin
      .from("post_comments")
      .select("id, user_id, post_id, content")
      .eq("status", "pending")
      .is("moderation_score", null)
      .limit(20); // Process more comments since they're lighter

    if (commentsError) {
      console.error("Error fetching pending comments:", commentsError);
      results.errors.push(`Comments fetch error: ${commentsError.message}`);
    } else if (pendingComments && pendingComments.length > 0) {
      for (const comment of pendingComments) {
        try {
          // Run AI moderation
          const moderationResult = await moderateComment({
            content: comment.content,
          });

          // Update comment with moderation result
          const { error: updateError } = await supabaseAdmin
            .from("post_comments")
            .update({
              status: moderationResult.approved ? "approved" : "rejected",
              moderation_score: moderationResult.score,
              moderation_reason: moderationResult.reason,
              moderated_at: new Date().toISOString(),
            })
            .eq("id", comment.id);

          if (updateError) {
            console.error(`Error updating comment ${comment.id}:`, updateError);
            results.errors.push(`Comment ${comment.id} update error: ${updateError.message}`);
          } else {
            results.comments_processed++;
            if (moderationResult.approved) {
              results.comments_approved++;
            } else {
              results.comments_rejected++;
            }
          }
        } catch (error) {
          console.error(`Error moderating comment ${comment.id}:`, error);
          results.errors.push(`Comment ${comment.id} moderation error: ${error.message}`);
        }
      }
    }

    return Response.json({
      ok: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (error) {
    console.error("Error in moderation cron job:", error);
    return Response.json(
      {
        ok: false,
        error: "Moderation cron job failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
