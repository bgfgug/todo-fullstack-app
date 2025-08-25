import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const TaskCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 flex-1" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-3 w-3/4 mt-2" />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1 w-full rounded-full" />
        </div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
};