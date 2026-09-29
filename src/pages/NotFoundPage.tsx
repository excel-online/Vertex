import { NavLink } from 'react-router-dom';
import { TrendingUp, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <NavLink to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-lg bg-gold flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-navy" />
          </div>
          <span className="text-2xl font-bold text-gold">Vellumtrade</span>
        </NavLink>

        {/* 404 Content */}
        <div className="glass-card p-8">
          <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/">
              <Button className="btn-trading w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </NavLink>
            <button onClick={() => window.history.back()}>
              <Button variant="outline" className="border-gold text-gold hover:bg-gold/10 w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground text-sm mt-8">
          Need help?{' '}
          <a 
            href="https://wa.me/14127078135" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
