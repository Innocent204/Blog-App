import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Sparkles, Lock, Mail, PenTool, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a1929] via-[#132f4c] to-[#0a1929]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-0.5">
                    <PenTool className="w-5 h-5 text-white" strokeWidth={2.5} />
                    <FileText className="w-4 h-4 text-white/80" strokeWidth={2} />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                  BlogCMS
                </h1>
                <div className="text-xs text-muted-foreground font-medium tracking-wider">CONTENT MANAGEMENT</div>
              </div>
            </div>
            <p className="text-muted-foreground">
              Content Management Made Simple
            </p>
          </motion.div>

          <Card className="backdrop-blur-sm bg-card/50 border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center text-2xl">
                Welcome Back
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Sign in to access your admin dashboard
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input-background border-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-input-background border-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                
                <div className="text-center text-sm mt-4">
                  <span className="text-muted-foreground">
                    Don't have an account?{' '}
                  </span>
                  <Link 
                    to="/register" 
                    className="text-primary hover:underline font-medium"
                  >
                    Create one
                  </Link>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Demo credentials:
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-primary">admin@example.com</span> - Admin access
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">editor@example.com</span> - Editor access
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Use any password)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}