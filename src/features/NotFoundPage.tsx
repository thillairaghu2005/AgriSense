import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Sprout, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <Sprout className="w-12 h-12 text-[var(--color-primary-600)] mb-4" />

      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary-800)] bg-[var(--color-primary-50)] px-2.5 py-1 rounded-full mb-2 border border-[var(--color-primary-200)]">
        Error 404 — Page Not Found
      </span>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
        We couldn&apos;t find this field
      </h1>

      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-md mt-2 mb-6">
        The page you requested might have been moved or does not exist. You can return to your farming dashboard or explore the crop library.
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="md"
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => navigate('/')}
        >
          Go to Dashboard
        </Button>
        <Button
          variant="outline"
          size="md"
          leftIcon={<Search className="w-4 h-4" />}
          onClick={() => navigate('/crops')}
        >
          Browse Crops
        </Button>
      </div>
    </div>
  );
}
