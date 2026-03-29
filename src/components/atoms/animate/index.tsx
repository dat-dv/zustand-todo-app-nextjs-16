'use client';

import { HTMLMotionProps, motion, Variants } from 'framer-motion';
import React from 'react';

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export interface AnimationContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export const AnimationContainer = ({ children, className, ...props }: AnimationContainerProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export interface AnimationItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export const AnimationItem = ({ children, className, ...props }: AnimationItemProps) => {
  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
};
