import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, FileText, Smartphone, AlertTriangle } from "lucide-react";
import axios from "axios";

const ANALYSIS_TYPES = [
  { id: "fake_news", label: "News / Text", icon: FileText },
  { id: "ai_text", label: "AI Generated", icon: AlertTriangle },
  { id: "sms", label: "Spam SMS", icon: Smartphone },
  { id: "image", label: "Fake Image", icon: ImageIcon },
];

export default function CreatePostModal({ isOpen, onClose, onSuccess }) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [analysisType, setAnalysisType] = useState("fake_news");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("text", text);
      formData.append("analysisType", analysisType);

      if (imageUrl && typeof imageUrl === 'object') { // Check if imageUrl is a File object
        formData.append("image", imageUrl); // Append as 'image' for file upload
      } else if (imageUrl) { // If it's a string URL
        formData.append("imageUrl", imageUrl); // Append as 'imageUrl'
      }

      const res = await axios.post("http://localhost:5000/api/chat/post",
        formData, // Send formData instead of a plain object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Explicitly set content type for FormData
          },
        }
      );

      if (res.data.success) {
        setText("");
        setImageUrl("");
        setAnalysisType("fake_news");
        onSuccess(res.data.post);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-lg bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Create Post</h2>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
                  Verification Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ANALYSIS_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setAnalysisType(type.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all duration-200
                        ${analysisType === type.id 
                          ? 'border-white bg-white text-black' 
                          : 'border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:border-white/30'}`}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
                  Content
                </label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text to be verified..."
                  required={analysisType !== "image"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all resize-none"
                />
              </div>

              {/* Image Input */}
              {analysisType === "image" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
                    Image file
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImageUrl(e.target.files[0]);
                      }
                    }}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  "Post to Community"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
