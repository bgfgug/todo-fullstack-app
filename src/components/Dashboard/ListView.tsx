import { useState } from 'react';
import { ArrowUpDown, Calendar, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Todo } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { EditTodoDialog } from '../EditTodoDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { cn } from '../../lib/utils';

interface ListViewProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}

type SortField = 'title' | 'priority' | 'dueDate' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',  
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  'todo': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  'done': 'bg-green-100 text-green-800',
};

export const ListView = ({ todos, loading, onToggle, onDelete, onUpdate }: ListViewProps) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [deleteTodo, setDeleteTodo] = useState<Todo | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      aValue = priorityOrder[a.priority];
      bValue = priorityOrder[b.priority];
    }

    if (sortField === 'dueDate') {
      aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    }

    if (sortField === 'createdAt') {
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleDelete = () => {
    if (deleteTodo) {
      onDelete(deleteTodo.id);
      setDeleteTodo(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('title')}
                  className="h-auto p-0 font-semibold"
                >
                  Task
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="h-auto p-0 font-semibold"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('priority')}
                  className="h-auto p-0 font-semibold"
                >
                  Priority
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Labels</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('dueDate')}
                  className="h-auto p-0 font-semibold"
                >
                  Due Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Subtasks</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTodos.map((todo, index) => {
              const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0;
              const totalSubtasks = todo.subtasks?.length || 0;
              const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

              return (
                <motion.tr
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className={cn(
                    "group hover:bg-muted/50 transition-colors",
                    todo.completed && "opacity-60"
                  )}
                >
                  <TableCell>
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => onToggle(todo.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className={cn(
                        "font-medium",
                        todo.completed && "line-through text-muted-foreground"
                      )}>
                        {todo.title}
                      </div>
                      {todo.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {todo.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[todo.status]}>
                      {todo.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={priorityColors[todo.priority]}>
                      {todo.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {todo.labels?.slice(0, 2).map((label) => (
                        <Badge 
                          key={label.id} 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: label.color + '20', color: label.color }}
                        >
                          {label.name}
                        </Badge>
                      ))}
                      {(todo.labels?.length || 0) > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{(todo.labels?.length || 0) - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {isOverdue ? (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      ) : todo.dueDate ? (
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {totalSubtasks > 0 ? (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {completedSubtasks}/{totalSubtasks}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
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
                        <DropdownMenuItem onClick={() => setEditTodo(todo)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteTodo(todo)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Dialog */}
      {editTodo && (
        <EditTodoDialog
          open={!!editTodo}
          onOpenChange={() => setEditTodo(null)}
          todo={editTodo}
          onUpdate={onUpdate}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTodo} onOpenChange={() => setDeleteTodo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTodo?.title}"? This action cannot be undone.
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
    </Card>
  );
};