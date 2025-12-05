import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UnauthorizedPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <AlertTriangle className="mx-auto mb-6 h-16 w-16 text-orange-500" />
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          Access Denied
        </h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. This feature is only
          available to sellers.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <p className="text-muted-foreground text-sm">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </Card>
    </div>
  );
}
