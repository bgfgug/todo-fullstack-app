import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { TaskCardSkeleton } from './TaskCardSkeleton';

interface BoardColumnSkeletonProps {
  title: string;
}

export const BoardColumnSkeleton = ({ title }: BoardColumnSkeletonProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-6 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
};