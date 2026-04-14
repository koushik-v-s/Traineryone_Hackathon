import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function PageWrapper({
  children,
  title,
  subtitle,
}: PageWrapperProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 min-h-screen px-6 pt-8 pb-28"
      style={{ maxWidth: "1400px", margin: "0 auto" }}
    >
      {title && (
        <div className="mb-8">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "#f1f5f9" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}
