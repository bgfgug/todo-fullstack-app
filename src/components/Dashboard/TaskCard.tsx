import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, MoreHorizontal, User } from 'lucide-react';
import { Todo } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Progress } from '../ui/progress';
import { EditTodoDialog } from '../EditTodoDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-red-100 text-red-800 border-red-300',
};

export const TaskCard = ({ todo, index, onToggle, onDelete, onUpdate }: TaskCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const completedSubtasks = todo.subtasks?.filter(subtask => subtask.completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleDelete = () => {
    onDelete(todo.id);
    setIsDeleteOpen(false);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "group",
            snapshot.isDragging && "rotate-2 shadow-lg"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              todo.completed && "opacity-60",
              isOverdue && "border-destructive"
            )}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => onToggle(todo.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <CardTitle className={cn(
                        "text-sm font-medium line-clamp-2",
                        todo.completed && "line-through text-muted-foreground"
                      )}>
                        {todo.title}
                      </CardTitle>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setIsDeleteOpen(true)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {todo.description && (
                  <CardDescription className="text-xs line-clamp-2">
                    {todo.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {/* Priority Badge */}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", priorityColors[todo.priority])}
                  >
                    {todo.priority}
                  </Badge>
                  
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>

                {/* Labels */}
                {todo.labels && todo.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {todo.labels.slice(0, 3).map((label) => (
                      <Badge 
                        key={label.id} 
                        variant="secondary" 
                        className="text-xs"
                        style={{ backgroundColor: label.color + '20', color: label.color }}
                      >
                        {label.name}
                      </Badge>
                    ))}
                    {todo.labels.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{todo.labels.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Subtasks Progress */}
                {totalSubtasks > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Subtasks
                      </span>
                      <span>{completedSubtasks}/{totalSubtasks}</span>
                    </div>
                    <Progress value={subtaskProgress} className="h-1" />
                  </div>
                )}

                {/* Due Date */}
                {todo.dueDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </div>
                )}

                {/* Created Date */}
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  {new Date(todo.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Dialog */}
          <EditTodoDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            todo={todo}
            onUpdate={onUpdate}
          />

          {/* Delete Confirmation */}
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{todo.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </Draggable>
  );
};