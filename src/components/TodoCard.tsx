import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit3, Clock, Flag } from 'lucide-react';
import { Todo } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { EditTodoDialog } from './EditTodoDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

export const TodoCard = ({ todo, onToggle, onDelete, onUpdate }: TodoCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <Card className={`transition-all duration-200 hover:shadow-md ${
        todo.completed ? 'opacity-60' : ''
      }`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => onToggle(todo.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-foreground ${
                  todo.completed ? 'line-through' : ''
                }`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`text-sm text-muted-foreground mt-1 ${
                    todo.completed ? 'line-through' : ''
                  }`}>
                    {todo.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{todo.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(todo.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge
                className={priorityColors[todo.priority]}
                variant="outline"
              >
                <Flag className="h-3 w-3 mr-1" />
                {todo.priority}
              </Badge>
              {todo.dueDate && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(todo.dueDate), 'MMM dd')}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTodoDialog
        todo={todo}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={onUpdate}
      />
    </>
  );
};