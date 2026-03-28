import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CommentNode from "./CommentNode";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/get-comments?postId=${postId}`);
      if (res.data.success) {
        setComments(res.data.roots || []);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/chat/create-comment",
        { postId, text: newComment, parentCommentId: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        // Fetch fresh comments to get populated user data quickly
        await fetchComments();
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-4 pb-2 text-sm">
      {/* Top-level comment input */}
      <form onSubmit={handleCreateComment} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="bg-white text-black px-4 py-2 rounded-full font-semibold transition-opacity disabled:opacity-50"
        >
          {submitting ? "..." : "Post"}
        </button>
      </form>

      {/* Loading state or Comments */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/5 rounded w-3/4"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentNode
                key={comment._id}
                comment={comment}
                postId={postId}
                onRefresh={fetchComments}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-white/40 text-center py-4 text-xs font-medium">No comments yet. Be the first to share your thoughts!</p>
      )}
    </div>
  );
}
