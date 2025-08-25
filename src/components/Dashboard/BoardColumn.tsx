import React from 'react';
import { cn } from '../../lib/utils';
import { Todo } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TaskCard } from './TaskCard';

interface BoardColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  tasks: Todo[];
  isDraggedOver: boolean;
  color: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => Promise<void>;
  children?: React.ReactNode;
}

export const BoardColumn = React.forwardRef<HTMLDivElement, BoardColumnProps>(
  ({ title, tasks, isDraggedOver, color, onToggle, onDelete, onUpdate, children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        <Card className={cn(
          "h-full transition-colors",
          isDraggedOver && "bg-muted/50",
          color
        )}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              {title}
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {tasks.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                todo={task}
                index={index}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
            {children}
          </CardContent>
        </Card>
      </div>
    );
  }
);

BoardColumn.displayName = 'BoardColumn';