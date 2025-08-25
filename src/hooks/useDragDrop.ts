import { useCallback } from 'react';
import { TaskStatus } from '../types';

interface UseDragDropProps {
  onStatusChange: (todoId: string, newStatus: TaskStatus) => void;
}

export const useDragDrop = ({ onStatusChange }: UseDragDropProps) => {
  const handleDragEnd = useCallback((result: any) => {
    const { destination, source, draggableId } = result;

    // If no destination or same position, do nothing
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // If moved to different column, update status
    if (destination.droppableId !== source.droppableId) {
      const newStatus = destination.droppableId as TaskStatus;
      onStatusChange(draggableId, newStatus);
    }
  }, [onStatusChange]);

  return {
    handleDragEnd,
  };
};