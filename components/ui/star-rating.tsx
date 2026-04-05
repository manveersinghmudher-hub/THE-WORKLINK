'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readonly?: boolean;
  className?: string;
}

export function StarRating({ value, onChange, size = 24, readonly = false, className }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={cn(
              'transition-colors focus:outline-none',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform',
            )}
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(
                'transition-colors',
                active ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-gray-300',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
