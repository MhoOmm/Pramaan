import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { CornerDownRight } from "lucide-react";

export default function CommentNode({ comment, postId, onRefresh, depth = 0 }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Stop indenting too much after depth 4 to prevent UI breaking on mobile
  const indentClass = depth > 0 ? (depth > 4 ? "ml-2 sm:ml-4 border-l border-white/10 pl-2 sm:pl-4" : "ml-4 sm:ml-8 border-l border-white/10 pl-4 sm:pl-6") : "";

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://backend-rust-beta-5dlclsgxuc.vercel.app/api/chat/create-comment",
        { postId, text: replyText, parentCommentId: comment._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setIsReplying(false);
        setReplyText("");
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error("Failed to reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`mt-3 ${indentClass}`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        {comment.user?.avatar ? (
          <img src={comment.user.avatar} alt={comment.user.userName} className="w-6 h-6 rounded-full bg-zinc-800 shrink-0 object-cover mt-1" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center text-[10px] font-semibold text-white/70 mt-1">
            {comment.user?.userName?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-white/90 text-sm">{comment.user?.userName || "Anonymous"}</span>
            <span className="text-[10px] text-white/40">
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}
            </span>
          </div>
          
          {/* Content */}
          <p className="text-white/80 text-sm leading-relaxed mb-1.5 whitespace-pre-wrap">{comment.text}</p>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs text-white/40 font-semibold hover:text-white/80 transition-colors flex items-center gap-1"
            >
              Reply
            </button>
          </div>

          {/* Reply Input Form */}
          <AnimatePresence>
            {isReplying && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleReplySubmit}
                className="mt-3 flex gap-2 overflow-hidden"
              >
                <CornerDownRight className="w-4 h-4 text-white/20 mt-2 shrink-0" />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    autoFocus
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors text-xs"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !replyText.trim()}
                    className="bg-white text-black px-3 py-1.5 rounded-full font-semibold transition-opacity disabled:opacity-50 text-xs shrink-0"
                  >
                    {submitting ? "..." : "Reply"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Children */}
      {comment.children && comment.children.length > 0 && (
        <div className="mt-1">
          {comment.children.map((child) => (
            <CommentNode
              key={child._id}
              comment={child}
              postId={postId}
              onRefresh={onRefresh}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
