import React from 'react'
import Button from './Button'

const StatusBadges = () => {
    return (
        <div className="bg-black/80 backdrop-blur-xl border border-white/8 rounded-2xl px-12 py-10">

            <h2 className="text-6xl font-bold mb-4 tracking-tight text-white">
                Verify before you trust.
            </h2>
            <p className="text-2xl text-white/45 mb-16">
                PRAMAAN — Truth powered by AI.
            </p>

            <div className="flex justify-center gap-8 mb-16">
                <div className="px-6 py-3 rounded-full glass-card border border-white/20 text-white/80 text-sm font-semibold tracking-widest">
                    ✓ VERIFIED
                </div>
                <div className="px-6 py-3 rounded-full glass-card border border-white/10 text-white/50 text-sm font-semibold tracking-widest">
                    ⚠ SUSPICIOUS
                </div>
                <div className="px-6 py-3 rounded-full glass-card border border-white/10 text-white/35 text-sm font-semibold tracking-widest">
                    ✕ FRAUD
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button className="w-full sm:w-auto">
                    Verify Content
                </Button>
            </div>

            <p className="mt-8 text-sm text-white/30">
                Built for users, journalists, and a safer digital world.
            </p>

        </div>
    )
}

export default StatusBadges