import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Users, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <CheckSquare className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Organize Your Life with{' '}
            <span className="text-primary">TodoApp</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The most intuitive and powerful todo application to help you stay organized, 
            boost productivity, and achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="text-lg px-8 py-6"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose TodoApp?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Packed with features to make task management effortless and efficient
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is protected with enterprise-grade security and encryption
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Optimized for speed with instant sync across all your devices
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Share and collaborate on tasks with your team members seamlessly
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Feature List */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Everything You Need</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <CheckSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Smart Organization</h3>
                  <p className="text-muted-foreground">Organize tasks by priority, due date, and categories</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Advanced Filtering</h3>
                  <p className="text-muted-foreground">Find exactly what you need with powerful search and filters</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Progress Tracking</h3>
                  <p className="text-muted-foreground">Monitor your productivity with detailed analytics</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <CheckSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Due Date Reminders</h3>
                  <p className="text-muted-foreground">Never miss a deadline with smart notifications</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Cross-Platform Sync</h3>
                  <p className="text-muted-foreground">Access your todos from any device, anywhere</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Backup & Export</h3>
                  <p className="text-muted-foreground">Your data is safe with automatic backups</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Organized?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who have transformed their productivity
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="text-lg px-8 py-6"
          >
            Start Your Journey Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
