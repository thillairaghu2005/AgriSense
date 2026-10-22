import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function RootErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'An unexpected error occurred while loading this page.';
  let errorStatus: number | string = 'Application Error';

  if (isRouteErrorResponse(error)) {
    errorStatus = `Error ${error.status}: ${error.statusText}`;
    errorMessage = typeof error.data === 'string' ? error.data : error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-surface-1)] text-center px-4 py-8 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4 border border-amber-500/20">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] px-2.5 py-1 rounded-md mb-3 border border-[var(--color-border)]">
        {errorStatus}
      </span>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
        Something went wrong
      </h1>

      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-md mt-2 mb-6 break-words">
        {errorMessage}
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="md"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
        <Button
          variant="outline"
          size="md"
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => navigate('/')}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
