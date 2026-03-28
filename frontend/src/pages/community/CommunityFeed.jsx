import React, { useState, useEffect } from "react";
import api from "../../../axios/index";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LayoutDashboard } from "lucide-react";
import PostCard from "../../components/community/PostCard";
import CreatePostModal from "../../components/community/CreatePostModal";
import Navbar from "../../components/Navbar";

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/chat/posts");
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    // Optimistically add to the feed at the top
    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/user/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-2xl mx-auto pt-28 pb-32 px-4 sm:px-6 relative z-10 w-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col items-center text-center relative"
        >
          <div className="absolute left-0 top-0 flex items-center gap-3">
            <Link 
              to="/dashboard"
              className="p-2.5 flex items-center justify-center text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all backdrop-blur-md"
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2.5 text-xs font-semibold tracking-widest uppercase text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all backdrop-blur-md"
            >
              Sign out
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
            Community Feed
          </h1>
          <p className="text-white/40 text-sm sm:text-base font-medium font-inter">
            Discover truth. Verify insights. Shape the internet.
          </p>
        </motion.div>

        {/* Feed List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Skeleton Loaders
              [...Array(3)].map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl glass-card animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5" />
                    <div className="space-y-2">
                      <div className="w-24 h-3 bg-white/5 rounded" />
                      <div className="w-16 h-2 bg-white/5 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-white/5 rounded" />
                    <div className="w-5/6 h-3 bg-white/5 rounded" />
                    <div className="w-2/3 h-3 bg-white/5 rounded" />
                  </div>
                </motion.div>
              ))
            ) : posts.length > 0 ? (
              posts.map((post, i) => (
                <PostCard
                  key={post._id}
                  post={post}
                  index={i}
                  onVoteUpdate={(updatedPost) => {
                    setPosts((prev) =>
                      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
                    );
                  }}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-white/40"
              >
                No posts yet. Be the first to start the conversation.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", bounce: 0.5 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white text-black shadow-[0_4px_32px_rgba(255,255,255,0.4)] hover:shadow-[0_4px_40px_rgba(255,255,255,0.6)] transition-shadow duration-300"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePostCreated}
      />
    </div>
  );
}
