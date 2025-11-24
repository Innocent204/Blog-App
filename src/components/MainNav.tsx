import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { FileText, Edit, BarChart3 } from 'lucide-react';

export function MainNav() {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Button asChild variant="ghost" className="text-foreground/60 hover:text-foreground hover:bg-transparent">
        <Link to="/dashboard">
          <FileText className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>
      <Button asChild variant="ghost" className="text-foreground/60 hover:text-foreground hover:bg-transparent">
        <Link to="/editor-dashboard">
          <Edit className="mr-2 h-4 w-4" />
          Editor
        </Link>
      </Button>
      <Button asChild variant="ghost" className="text-foreground/60 hover:text-foreground hover:bg-transparent">
        <Link to="/analytics">
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </Link>
      </Button>
    </nav>
  );
}
