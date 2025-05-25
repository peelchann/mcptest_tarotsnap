'use client';

import { motion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Animation variants for consistent motion design
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export const mysticalFloat: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1
    }
  }
};

export const cardFlip: Variants = {
  hidden: { rotateY: -90, opacity: 0 },
  visible: { 
    rotateY: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Reusable animation components
interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}

export function AnimatedContainer({ 
  children, 
  className = "", 
  variants = fadeInUp,
  delay = 0 
}: AnimatedContainerProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredContainer({ children, className = "" }: AnimatedContainerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function FloatingCard({ children, className = "" }: AnimatedContainerProps) {
  return (
    <motion.div
      className={className}
      variants={mysticalFloat}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

export function MysticalButton({ children, className = "", onClick }: AnimatedContainerProps & { onClick?: () => void }) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.button>
  );
} 