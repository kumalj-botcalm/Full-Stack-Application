import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Form } from '../../components/ui/form';
import { FormInput } from '../../components/customUi/form-input';
import { useLogin } from '../../hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { LoginSchema, LoginFormData } from '../../schema';
import type { LoginData } from '../../apis/auth';

export default function LoginPage() {
  const loginMutation = useLogin();
  const { theme, setTheme } = useTheme();

  // Force light theme for login page only, restore previous on unmount
  useEffect(() => {
    const prev = theme;
    setTheme('light');
    return () => setTheme(prev);
  }, []);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    control,
  } = form;

  const onSubmit = async (data: LoginFormData) => {
    // The useLogin hook now handles success/error messages and navigation
    loginMutation.mutate(data as LoginData);
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-xl space-y-6 p-6">
        <div className="text-center">
          <LogIn className="text-primary mx-auto h-12 w-12" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account to continue.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
            />

            <FormInput
              control={control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>

        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Create account
            </Link>
          </p>
          <Link
            to=""
            className="hover:text-primary block text-sm text-gray-600"
          >
            Forgot your password?
          </Link>
        </div>
      </Card>
    </div>
  );
}
