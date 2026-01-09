import { type HTMLAttributes, forwardRef } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', width, height, className = '', style, ...props }, ref) => {
    const variantStyles = {
      text: 'h-4 rounded',
      circular: 'rounded-full aspect-square',
      rectangular: 'rounded-lg',
    };

    return (
      <div
        ref={ref}
        className={`
          bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
          bg-[length:200%_100%] animate-shimmer
          ${variantStyles[variant]}
          ${className}
        `}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export const SkeletonCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white rounded-xl border border-gray-100 p-6 ${className}`}
      {...props}
    >
      <Skeleton variant="rectangular" height={160} className="mb-4" />
      <Skeleton width="60%" className="mb-2" />
      <Skeleton width="80%" className="mb-4" />
      <div className="flex gap-2">
        <Skeleton width={80} height={32} variant="rectangular" />
        <Skeleton width={80} height={32} variant="rectangular" />
      </div>
    </div>
  )
);

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonText = forwardRef<HTMLDivElement, { lines?: number } & HTMLAttributes<HTMLDivElement>>(
  ({ lines = 3, className = '', ...props }, ref) => (
    <div ref={ref} className={`space-y-2 ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '70%' : '100%'} />
      ))}
    </div>
  )
);

SkeletonText.displayName = 'SkeletonText';
