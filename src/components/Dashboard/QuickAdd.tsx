import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface QuickAddProps {
  onCreate: (data: { title: string; description: string; priority: 'low' | 'medium' | 'high' }) => Promise<void>;
}

export const QuickAdd = ({ onCreate }: QuickAddProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        description: '',
        priority: 'medium',
      });
      setTitle('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-80 shadow-lg">
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Quick Add Task</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!title.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Adding...' : 'Add Task'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all",
            isOpen && "rotate-45"
          )}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
};