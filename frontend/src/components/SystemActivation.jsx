import React from 'react'
import { motion } from 'framer-motion';

const SystemActivation = ({ actOpacity, actY }) => {
  return (
    <div>
      <motion.div style={{ opacity: actOpacity, y: actY }} className="max-w-xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
                An AI system <br />
                <span className="text-white/60">built for truth.</span>
              </h2>
              <p className="text-xl text-white/70 mb-4 leading-relaxed">
                Advanced models analyze images, text, and digital signals in real time.
              </p>
              <p className="text-xl text-white/70 leading-relaxed">
                Designed to identify manipulation, deception, and hidden intent.
              </p>
            </motion.div>
    </div>
  )
}

export default SystemActivation
