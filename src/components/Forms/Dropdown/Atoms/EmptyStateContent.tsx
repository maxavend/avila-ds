import { Telescope } from 'lucide-react';

export type DropdownSize = 'L' | 'M';

const EMPTY_STATE_ICON_SIZE: Record<DropdownSize, number> = { L: 64, M: 48 };

export function EmptyStateContent({
  size,
  text,
}: {
  size: DropdownSize;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-6 w-full min-h-[160px]">
      <Telescope
        size={EMPTY_STATE_ICON_SIZE[size]}
        className="text-primary-text-default flex-shrink-0"
        strokeWidth={1.5}
      />
      <p className="text-base leading-[20px] text-neutral-text-default text-center font-sans max-w-[200px]">
        {text}
      </p>
    </div>
  );
}

EmptyStateContent.displayName = 'EmptyStateContent';
