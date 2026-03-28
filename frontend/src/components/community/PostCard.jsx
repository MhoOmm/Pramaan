import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ArrowDown, MessageSquare, ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import CommentSection from "./CommentSection";

export default function PostCard({ post, index, onVoteUpdate }) {
  const [isVoting, setIsVoting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user._id;

  const handleVote = async (value) => {
    if (isVoting) return;
    setIsVoting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://pramaan-omega.vercel.app/api/chat/vote", 
        { postId: post._id, value },
        { headers: { Authorization: `Bearer ${token}` } } // Assuming standard Bearer or token based auth.
      );
      if (res.data.success && onVoteUpdate) {
        onVoteUpdate(res.data.post);
      }
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setIsVoting(false);
    }
  };

  const userVote = post.votes?.find(v => v.user === currentUserId)?.value;
  const netVotes = (post.upvotes || 0) - (post.downvotes || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="glass-card p-5 sm:p-6 hover:border-[rgba(255,255,255,0.12)] transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {post.user?.avatar ? (
          <img src={post.user.avatar} alt={post.user.userName} className="w-10 h-10 rounded-full bg-zinc-800 object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold text-white/70">
            {post.user?.userName?.charAt(0)?.toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-white/90">
            {post.user?.userName || "Anonymous"}
          </h3>
          <p className="text-xs text-white/40">
            {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Just now'}
          </p>
        </div>
        
        {/* ML Result Badge */}
        {post.mlChecked && post.mlResult && (
          <div className={`ml-auto px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full border flex items-center gap-1.5
            ${post.mlResult.verdict?.toLowerCase() === 'real' || post.mlResult.verdict === 0
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
          >
            {post.mlResult.verdict?.toLowerCase() === 'real' || post.mlResult.verdict === 0 ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            {post.mlResult.verdict?.toLowerCase() === 'real' || post.mlResult.verdict === 0 ? "Verified Authentic" : "Flagged Content"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-5 space-y-4">
        {post.text && <p className="text-white/80 leading-relaxed font-inter text-sm sm:text-base whitespace-pre-wrap">{post.text}</p>}
        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-white/5 bg-zinc-900/50">
            <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-white/5 pt-4">
        <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-1">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => handleVote(1)}
            disabled={isVoting || post.user?._id === currentUserId}
            className={`p-1.5 rounded-full transition-colors ${userVote === 1 ? 'text-emerald-400' : 'text-white/40 hover:text-white/80'} disabled:opacity-50`}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
          
          <span className="text-xs font-semibold text-white/70 min-w-[2ch] justify-center flex">
            {netVotes}
          </span>
          
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => handleVote(-1)}
            disabled={isVoting || post.user?._id === currentUserId}
            className={`p-1.5 rounded-full transition-colors ${userVote === -1 ? 'text-red-400' : 'text-white/40 hover:text-white/80'} disabled:opacity-50`}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors text-white/40 hover:text-white/80"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-semibold">Comments</span>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-2 border-t border-white/5"
          >
            <CommentSection postId={post._id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
