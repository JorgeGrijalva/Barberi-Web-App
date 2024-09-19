"use client";

import React from "react";
import { motion } from "framer-motion";

// eslint-disable-next-line prefer-arrow-functions/prefer-arrow-functions
export default function AnimationBackground() {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 100, repeat: Infinity, repeatType: "loop" }}
      aria-hidden="true"
      className="absolute left-[calc(50%-36rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] xl:left-[calc(50%-24rem)]"
    >
      <div
        style={{
          clipPath:
            "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
        }}
        className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#0033FF] to-[#0033FF] opacity-30"
      />
    </motion.div>
  );
}
