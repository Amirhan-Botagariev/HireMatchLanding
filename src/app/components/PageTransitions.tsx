"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function PageTransitions({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={locale}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}