"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

export default ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  // Make on view animation
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0 }}
      animate={{ scale: inView ? 1 : 0 }}
      transition={{ duration: 0.5, bounce: 1 }}
    >
      {children}
    </motion.div>
  );
};
