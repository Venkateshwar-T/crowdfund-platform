'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, children, isLoading, disabled, asChild = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        asChild={asChild}
        disabled={isLoading || disabled}
        className={cn('font-semibold transition-all hover:opacity-90 active:scale-95', className)}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {children}
          </>
        )}
      </Button>
    );
  }
);

CustomButton.displayName = 'CustomButton';
