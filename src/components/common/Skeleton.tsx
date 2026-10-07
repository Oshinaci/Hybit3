import React from 'react';

/**
 * Base shimmer component for building high-performance,
 * lightweight skeleton loading interfaces.
 */
export const SkeletonItem: React.FC<{
  className?: string;
  rounded?: string;
}> = ({ className = 'h-4 w-full', rounded = 'rounded-xl' }) => (
  <div
    className={`relative overflow-hidden bg-white/[0.05] border border-white/[0.04] ${rounded} ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
  </div>
);

/**
 * Full skeleton layout for the Dashboard Home page.
 */
export const DashboardHomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 max-w-xl mx-auto w-full animate-in fade-in duration-300">
      {/* 1. Balance Card Skeleton */}
      <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkeletonItem className="h-5 w-20" rounded="rounded-lg" />
            <SkeletonItem className="h-4 w-12" rounded="rounded-full" />
          </div>
          <SkeletonItem className="h-6 w-6" rounded="rounded-full" />
        </div>

        {/* Big Balance Number */}
        <div className="space-y-2 py-1">
          <SkeletonItem className="h-10 w-48 sm:w-60" rounded="rounded-xl" />
          <SkeletonItem className="h-4 w-32" rounded="rounded-md" />
        </div>

        {/* Card Footer tags */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <SkeletonItem className="h-6 w-36" rounded="rounded-full" />
          <SkeletonItem className="h-5 w-20" rounded="rounded-md" />
        </div>
      </div>

      {/* 2. Quick Actions Bar Skeleton */}
      <div className="grid grid-cols-5 gap-2 py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <SkeletonItem className="w-13 h-13 sm:w-14 sm:h-14" rounded="rounded-2xl" />
            <SkeletonItem className="h-3 w-10" rounded="rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Holdings Assets Card Skeleton */}
      <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between px-1 pb-1">
          <SkeletonItem className="h-4 w-28" rounded="rounded-md" />
          <SkeletonItem className="h-4 w-16" rounded="rounded-md" />
        </div>

        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.03]"
            >
              <div className="flex items-center gap-3">
                <SkeletonItem className="w-10 h-10" rounded="rounded-xl" />
                <div className="space-y-1.5">
                  <SkeletonItem className="h-4 w-16" rounded="rounded-md" />
                  <SkeletonItem className="h-3 w-24" rounded="rounded-sm" />
                </div>
              </div>

              <div className="text-right space-y-1.5">
                <SkeletonItem className="h-4 w-20 ml-auto" rounded="rounded-md" />
                <SkeletonItem className="h-3 w-12 ml-auto" rounded="rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recent Transactions Skeleton */}
      <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between px-1">
          <SkeletonItem className="h-4 w-32" rounded="rounded-md" />
          <SkeletonItem className="h-4 w-14" rounded="rounded-md" />
        </div>

        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02]"
            >
              <div className="flex items-center gap-3">
                <SkeletonItem className="w-9 h-9" rounded="rounded-xl" />
                <div className="space-y-1">
                  <SkeletonItem className="h-3.5 w-28" rounded="rounded-md" />
                  <SkeletonItem className="h-2.5 w-16" rounded="rounded-sm" />
                </div>
              </div>
              <SkeletonItem className="h-4 w-20" rounded="rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for the Portfolio page.
 */
export const PortfolioSkeleton: React.FC = () => {
  return (
    <div className="space-y-5 max-w-4xl mx-auto w-full animate-in fade-in duration-300">
      {/* Chart Card Skeleton */}
      <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <SkeletonItem className="h-4 w-28" rounded="rounded-md" />
            <SkeletonItem className="h-9 w-48" rounded="rounded-xl" />
          </div>
          <SkeletonItem className="h-7 w-28" rounded="rounded-full" />
        </div>

        {/* Chart SVG Canvas placeholder */}
        <SkeletonItem className="h-44 w-full" rounded="rounded-2xl" />

        <div className="flex justify-between gap-2 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonItem key={i} className="h-8 flex-1" rounded="rounded-xl" />
          ))}
        </div>
      </div>

      {/* Asset Breakdown Skeleton */}
      <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-5 space-y-3">
        <SkeletonItem className="h-5 w-36" rounded="rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] space-y-2">
              <div className="flex justify-between items-center">
                <SkeletonItem className="w-8 h-8" rounded="rounded-lg" />
                <SkeletonItem className="h-4 w-12" rounded="rounded-md" />
              </div>
              <SkeletonItem className="h-5 w-24" rounded="rounded-md" />
              <SkeletonItem className="h-3 w-16" rounded="rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for the Activity / Transaction History page.
 */
export const ActivitySkeleton: React.FC = () => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto w-full animate-in fade-in duration-300">
      {/* Search & Filter bar skeleton */}
      <div className="flex gap-2">
        <SkeletonItem className="h-11 flex-1" rounded="rounded-2xl" />
        <SkeletonItem className="h-11 w-24" rounded="rounded-2xl" />
      </div>

      {/* Transactions list */}
      <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-4 sm:p-5 space-y-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.03]"
          >
            <div className="flex items-center gap-3">
              <SkeletonItem className="w-10 h-10" rounded="rounded-xl" />
              <div className="space-y-1.5">
                <SkeletonItem className="h-4 w-36" rounded="rounded-md" />
                <SkeletonItem className="h-3 w-20" rounded="rounded-sm" />
              </div>
            </div>
            <div className="text-right space-y-1.5">
              <SkeletonItem className="h-4 w-24 ml-auto" rounded="rounded-md" />
              <SkeletonItem className="h-3 w-14 ml-auto" rounded="rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
