import * as React from 'react';
import { cn } from '../../../../lib/utils';

export type RadiobuttonState = 'Default' | 'Hover' | 'Disabled';

export interface RadiobuttonAtomProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  state?: RadiobuttonState;
  ref?: React.Ref<HTMLDivElement>;
}

export const RadiobuttonAtom = ({
  isActive = false,
  state = 'Default',
  className,
  ref,
  ...props
}: RadiobuttonAtomProps) => {
  const isInactive = state === 'Disabled';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        // Base geometry: 20x20px Fixed
        "flex shrink-0 items-center justify-center size-5 rounded-full border border-solid t-control-colors",
        "  ",

        // Default Unchecked
        !isActive && !isInactive && "bg-transparent border-neutral-border-default",
        // Default Checked
        isActive && !isInactive && "bg-secondary-bg-default border-transparent",
        // Disabled (Checked or Unchecked)
        isInactive && "bg-neutral-bg-action-disabled border-neutral-border-action-disabled !transition-none",
        
        className
      )}
      {...props}
    >
      {/* Dots Mapping */}
      {!isActive && !isInactive && (
        <div className="size-2 rounded-full bg-neutral-border-strong opacity-0 group-hover/radiobutton:opacity-100" />
      )}

      {isActive && (
        <div 
          className={cn(
            "size-2 rounded-full",
            isInactive ? "bg-neutral-text-action-disabled" : "bg-white-white" 
          )} 
        />
      )}
    </div>
  );
};

RadiobuttonAtom.displayName = 'RadiobuttonAtom';
