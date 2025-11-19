import { useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAirbearSession } from '@/hooks/use-airbear-session';
import LoadingSpinner from './loading-spinner';

interface ProtectedViewProps {
  children: ReactNode;
  /**
   * Optional text shown while the session is being validated.
   */
  loadingText?: string;
}

export default function ProtectedView({ children, loadingText = 'Securing the ride...' }: ProtectedViewProps) {
  const { user, loading } = useAirbearSession();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      const redirectTarget = encodeURIComponent(location);
      setLocation(`/login?redirect=${redirectTarget}`);
    }
  }, [loading, location, setLocation, user]);

  if (loading) {
    return (
      <div className="min-h-[240px] flex items-center justify-center px-4">
        <LoadingSpinner size="lg" text={loadingText} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
