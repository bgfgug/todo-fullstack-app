import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { TaskStatus, Todo } from '../../types';
import { BoardColumn } from './BoardColumn';
import { BoardColumnSkeleton } from '../SkeletonsLoaders/BoardColumnSkeleton';

interface KanbanBoardProps {
  todos: Todo[];
  loading: boolean;
  onStatusChange: (todoId: string, newStatus: TaskStatus) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}

const COLUMN_CONFIG = [
  { id: 'todo' as TaskStatus, title: 'To Do', color: 'border-muted' },
  { id: 'in-progress' as TaskStatus, title: 'In Progress', color: 'border-primary' },
  { id: 'done' as TaskStatus, title: 'Done', color: 'border-green-500' },
];

export const KanbanBoard = ({
  todos,
  loading,
  onStatusChange,
  onToggle,  
  onDelete,
  onUpdate,
}: KanbanBoardProps) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as TaskStatus;
    onStatusChange(draggableId, newStatus);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return todos.filter(todo => todo.status === status);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {COLUMN_CONFIG.map((column) => (
          <BoardColumnSkeleton key={column.id} title={column.title} />
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMN_CONFIG.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <BoardColumn
                ref={provided.innerRef}
                {...provided.droppableProps}
                title={column.title}
                tasks={getTasksByStatus(column.id)}
                isDraggedOver={snapshot.isDraggingOver}
                color={column.color}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              >
                {provided.placeholder}
              </BoardColumn>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};