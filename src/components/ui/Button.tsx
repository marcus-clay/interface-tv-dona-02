import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { CircleNotch } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-accent-primary text-white hover:bg-red-700 shadow-glow border border-transparent",
      secondary: "bg-white text-black hover:scale-105 border border-transparent",
      ghost: "bg-transparent text-white hover:bg-white/10 border border-transparent",
      glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
      xl: "px-10 py-5 text-xl",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:pointer-events-none tracking-wide",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <CircleNotch className="w-5 h-5 animate-spin absolute" />
        )}
        
        <span className={cn("flex items-center gap-2", isLoading && "opacity-0")}>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";