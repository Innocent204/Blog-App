import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Shield,
  Users,
  Layers,
  Code,
  Moon,
  Sun,
  Check,
  ArrowRight,
  Globe,
  TrendingUp,
  Lock,
  PenTool,
  FileText,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const handleGetStarted = () => {
    navigate('/login');
  };
  
  const handleSignIn = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with Next.js 16 for optimal performance and speed',
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: 'Role-based access control and secure authentication',
    },
    {
      icon: Layers,
      title: 'Rich Text Editor',
      description: 'Powerful TipTap editor with all the formatting tools you need',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Admin and editor roles for seamless team workflows',
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Clean API, TypeScript support, and modern architecture',
    },
    {
      icon: Globe,
      title: 'Responsive Design',
      description: 'Beautiful UI that works perfectly on any device',
    },
  ];

  const plans = [
    {
      name: 'Editor',
      price: 'Free',
      description: 'Perfect for content creators',
      features: [
        'Create and edit posts',
        'Rich text editor',
        'Category management',
        'Draft & publish workflow',
        'Profile dashboard',
      ],
    },
    {
      name: 'Admin',
      price: 'Custom',
      description: 'Full control for administrators',
      features: [
        'Everything in Editor',
        'Manage all posts',
        'User management',
        'Advanced analytics',
        'Custom permissions',
        'Priority support',
      ],
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-card/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-0.5">
                    <PenTool className="w-4 h-4 text-white" strokeWidth={2.5} />
                    <FileText className="w-3.5 h-3.5 text-white/80" strokeWidth={2} />
                  </div>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">BlogCMS</h2>
                <div className="text-xs text-muted-foreground font-medium tracking-wider">CONTENT MANAGEMENT</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="border-border hover:bg-muted"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" onClick={handleSignIn} className="mr-2">
                Sign In
              </Button>
              <Button onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm">Next-Gen Content Management</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-bold">
                Content Management
                <br />
                Made Simple
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                A powerful, modern CMS built with Next.js, TypeScript, and TipTap.
                Perfect for teams and individuals who want full control over their content.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleGetStarted} className="shadow-lg shadow-primary/20">
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Free for editors</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl mb-4">
                Everything you need to create amazing content
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built with modern technologies and best practices for the best experience
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all hover:border-primary/40">
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl mb-4">
                Choose your role
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start as an editor or upgrade to admin for full control
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card
                  className={`h-full ${
                    plan.highlighted
                      ? 'border-primary shadow-xl shadow-primary/10 relative'
                      : ''
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                        Popular
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl">{plan.price}</span>
                      {plan.price !== 'Free' && (
                        <span className="text-muted-foreground ml-2">/ contact us</span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? 'default' : 'outline'}
                      onClick={onGetStarted}
                    >
                      Get Started
                    </Button>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl mb-6">
              Ready to start creating?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of content creators using BlogCMS
            </p>
            <Button size="lg" onClick={onGetStarted} className="shadow-lg shadow-primary/20">
              Get Started for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300">
                    <div className="flex items-center gap-0.5">
                      <PenTool className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      <FileText className="w-3 h-3 text-white/80" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">BlogCMS</h3>
                  <div className="text-xs text-muted-foreground font-medium tracking-wider">CONTENT MANAGEMENT</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern content management for modern teams
              </p>
            </div>
            <div>
              <h4 className="mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 BlogCMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
