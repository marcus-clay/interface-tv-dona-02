import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-white transition-colors">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-surface-card/50 border border-white/10 rounded-sm py-4 px-4 text-white placeholder:text-text-muted focus:outline-none focus:border-white/30 focus:bg-surface-card transition-all",
            icon && "pl-12",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";