import React, { useState } from 'react'
import { motion, useTransform } from 'framer-motion';
import Button from './Button';
import BlurText from "./BlurText";

const ModuleCard = ({ title, desc, route, index, scrollYProgress }) => {
    const [isHovered, setIsHovered] = useState(false);
    const x = useTransform(
        scrollYProgress,
        [0.55, 0.7],
        [index % 2 === 0 ? -50 : 50, 0]
    );
    const opacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);

    return (
        <motion.div
            style={{ x, opacity }}
            className="flex justify-end items-center gap-8 w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex-1 text-right min-h-[40px] flex items-center justify-end whitespace-nowrap">
                {isHovered && (
                    <BlurText
                        text={desc}
                        delay={30}
                        animateBy="words"
                        direction="top"
                        className="text-6xl text-white"
                    />
                )}
            </div>

            <a href={route || "#"} className="flex-shrink-0 w-64 block">
                <Button className="w-full flex justify-center">
                    {title}
                </Button>
            </a>
        </motion.div>
    );
};

const MultipleModel = ({ modTitleOpacity, scrollYProgress }) => {
    return (
        <div>
            <div className="sticky top-0 h-screen flex flex-col justify-center w-full items-end">
                <motion.div style={{ opacity: modTitleOpacity }} className="mb-12 w-full text-left">
                    <h2 className="text-5xl font-bold mb-6 leading-tight text-white">
                        Multi-layer detection.<br />One system.
                    </h2>
                </motion.div>

                <div className="flex flex-col gap-6 w-full">
                    {[
                        { name: 'Deepfake Detection', desc: 'Detect Synthetic Media.', route: '/detect/deepfake' },
                        { name: 'Email Phishing', desc: 'Detect Phishing Scam Emails', route: '/detect/phishing' },
                        { name: 'SMS Fraud', desc: 'Analyze Fake and Scam SMS', route: '/detect/sms' },
                        { name: 'Fake News', desc: 'Flag Suspicious News.', route: '/detect/fakenews' },
                        { name: 'AI Text Detection ', desc: 'Distinguish AI Generated Text.', route: '/detect/AItext' },
                        { name: 'Fake Links', desc: 'Analyze Malicious URLs.', route: '/detect/fakelinks' }
                    ].map((module, i) => (
                        <ModuleCard key={module.name} title={module.name} desc={module.desc} route={module.route} index={i} scrollYProgress={scrollYProgress} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MultipleModel
