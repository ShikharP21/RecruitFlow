import { Skeleton } from "@/components/ui/skeleton";

const CandidateGridSkeleton = () => {
  return (
    <div className="flex flex-col h-full px-5 pt-6 pb-4">
      {/* Header Skeleton */}
      <div className="flex-shrink-0 space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-full p-2">
            <div className="bg-card border border-border h-[240px] rounded-lg flex flex-col mx-5">
              <div className="p-4 pb-3 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 min-w-0 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded flex-shrink-0" />
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col min-h-0">
                <div className="flex flex-col h-full">
                  <div className="flex gap-4 flex-shrink-0">
                    <div className="w-64 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex-1 flex flex-col relative">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-12" />
                        <div className="flex flex-wrap gap-1">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-14" />
                          <Skeleton className="h-5 w-18" />
                          <Skeleton className="h-5 w-12" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0">
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateGridSkeleton;
