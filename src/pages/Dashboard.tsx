import { useEffect, useState } from 'react';
import { LogOut, User, BarChart3, Grid3X3, List, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTodos } from '../context/TodoContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { KanbanBoard } from '../components/Dashboard/KanbanBoard';
import { ListView } from '../components/Dashboard/ListView';
import { QuickAdd } from '../components/Dashboard/QuickAdd';
import { CreateTodoDialog } from '../components/CreateTodoDialog';
import { TodoFilters } from '../components/TodoFilters';
import { Pagination } from '../components/Pagination';
import { TaskStatus } from '../types';

type ViewMode = 'kanban' | 'list';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  
  const {
    todos,
    total,
    page,
    totalPages,
    loading,
    filters,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilters,
    setPage,
  } = useTodos();

  useEffect(() => {
    fetchTodos();
  }, [page, filters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = async (todoId: string, newStatus: TaskStatus) => {
    try {
      await updateTodo(todoId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const inProgressCount = todos.filter(todo => todo.status === 'in-progress').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Todo Dashboard</h1>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Welcome back, {user?.name}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-xs text-muted-foreground">
                {todos.length} shown
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <p className="text-xs text-muted-foreground">
                {total > 0 ? Math.round((completedCount / total) * 100) : 0}% completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{inProgressCount}</div>
              <p className="text-xs text-muted-foreground">
                Currently working on
              </p>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <CreateTodoDialog onCreate={createTodo} />
            
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  <span className="hidden sm:inline">Kanban</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <TodoFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        <Separator className="my-6" />

        {/* Main Content Area */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {todos.length === 0 && !loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {Object.keys(filters).some(key => filters[key as keyof typeof filters])
                    ? "No tasks match your current filters. Try adjusting your search criteria."
                    : "Get started by creating your first task!"}
                </p>
                {!Object.keys(filters).some(key => filters[key as keyof typeof filters]) && (
                  <CreateTodoDialog onCreate={createTodo} />
                )}
              </CardContent>
            </Card>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              todos={todos}
              loading={loading}
              onStatusChange={handleStatusChange}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ) : (
            <ListView
              todos={todos}
              loading={loading}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && viewMode === 'list' && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              total={total}
              limit={10}
            />
          </div>
        )}
      </main>

      {/* Quick Add Floating Button */}
      <QuickAdd onCreate={createTodo} />
    </div>
  );
};