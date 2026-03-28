import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, ArrowLeft, Trophy, Activity } from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://backend-rust-beta-5dlclsgxuc.vercel.app/api/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setProfile(res.data.user);
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 selection:bg-white/30 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation */}
        <Link 
          to="/community" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>

        {/* Header Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-8 relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.userName} 
              className="w-32 h-32 rounded-3xl object-cover border border-white/10 shadow-2xl"
            />
          ) : (
            <div className="w-32 h-32 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center text-4xl font-bold">
              {profile?.userName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left space-y-4 z-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">{profile?.userName}</h1>
              <p className="text-white/40">{profile?.email}</p>
            </div>
            
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                <Coins className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-emerald-400 leading-none">
                  {profile?.karma || 0}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Karma Coins</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 flex items-center gap-4"
          >
            <div className="p-3 rounded-2xl bg-white/5 text-white/60">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Posts Authored</p>
              <p className="text-2xl font-bold">{profile?.posts?.length || 0}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 flex items-center gap-4"
          >
            <div className="p-3 rounded-2xl bg-white/5 text-white/60">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Account Standing</p>
              <p className="text-xl font-bold text-emerald-400">Excellent</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
