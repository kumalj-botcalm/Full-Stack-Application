import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Form } from '../../components/ui/form';
import { FormInput } from '../../components/customUi/form-input';
import { FormSelect } from '../../components/customUi/form-select';
import { useRegister } from '../../hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { RegisterSchema, RegisterFormData } from '../../schema';
import type { RegisterData } from '../../apis/auth';

export default function RegisterPage() {
  const registerMutation = useRegister();
  const { theme, setTheme } = useTheme();

  // Force light theme for register page only, restore previous on unmount
  useEffect(() => {
    const prev = theme;
    setTheme('light');
    return () => setTheme(prev);
  }, []);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      birthDate: '',
      mobileNumber: '',
      role: 'customer' as const,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    control,
  } = form;

  const onSubmit = async (data: RegisterFormData) => {
    // The useRegister hook now handles success/error messages and navigation
    registerMutation.mutate(data as RegisterData);
  };

  const isLoading = registerMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl space-y-6 p-6">
        <div className="text-center">
          <UserPlus className="text-primary mx-auto h-12 w-12" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join us today! Your login credentials will be sent to your email.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={control}
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
            />

            <FormInput
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
            />

            <FormInput
              control={control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
            />

            <FormInput
              control={control}
              name="birthDate"
              label="Birth Date"
              type="date"
            />

            <FormInput
              control={control}
              name="mobileNumber"
              label="Mobile Number"
              placeholder="Enter your mobile number"
            />

            <FormSelect
              control={control}
              name="role"
              label="Account Type"
              options={[
                { value: 'customer', label: 'Customer' },
                { value: 'seller', label: 'Seller' },
              ]}
              placeholder="Select your account type"
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>📧 Password Delivery:</strong> Your login password will be automatically generated and sent to your email address for security.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account & Send Password'}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
