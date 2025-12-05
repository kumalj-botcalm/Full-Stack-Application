import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Save, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Form } from '../../components/ui/form';
import { FormInput } from '../../components/customUi/form-input';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserSchema, UserFormData, ChangePasswordSchema, ChangePasswordFormData } from '../../schema';
import { useProfileMutations } from '../../hooks/useProfile';
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useAuthContext();
  const { updateProfile, isUpdating, changePassword, isChangingPassword } = useProfileMutations();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      mobileNumber: user?.mobileNumber || '',
      birthDate: user?.birthDate ? user.birthDate.split('T')[0] : '', // Convert to YYYY-MM-DD format
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isDirty },
    control,
  } = form;

  const onSubmit = async (data: UserFormData) => {
    try {
      await updateProfile.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        birthDate: data.birthDate,
      });
    } catch {
      // Error is handled in the mutation
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      // Reset form and hide password form on success
      passwordForm.reset();
      setShowPasswordForm(false);
    } catch {
      // Error is handled in the mutation
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-foreground text-3xl font-bold">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <Card className="space-y-6 p-6">
          {/* User Avatar Section */}
          <div className="border-border flex items-center space-x-4 border-b pb-6">
            <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
              <User className="text-primary h-10 w-10" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-muted-foreground text-sm">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              </div>

              <FormInput
                control={control}
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                disabled
              />

              <FormInput
                control={control}
                name="mobileNumber"
                label="Mobile Number"
                placeholder="Enter your mobile number"
              />

              <FormInput
                control={control}
                name="birthDate"
                label="Birth Date"
                type="date"
              />

              {/* Account Info Section */}
              <div className="border-border border-t pt-6">
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground">User ID</label>
                    <p className="text-foreground font-medium">
                      #{user.userId}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">
                      Account Type
                    </label>
                    <p className="text-foreground font-medium capitalize">
                      {user.role}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">
                      Account Status
                    </label>
                    <p
                      className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Last Login</label>
                    <p className="text-foreground font-medium">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : 'Never'}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Created</label>
                    <p className="text-foreground font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={!isDirty || isUpdating}
                >
                  Reset Changes
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || !isDirty || isUpdating}
                  className="min-w-[120px]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </Card>

        {/* Password Change Section */}
        <Card className="p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update your account password
              </p>
            </div>
            <Button
              type="button"
              variant={showPasswordForm ? "outline" : "default"}
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                if (showPasswordForm) {
                  passwordForm.reset();
                }
              }}
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          {showPasswordForm && (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormInput
                      control={passwordForm.control}
                      name="currentPassword"
                      label="Current Password"
                      type="password"
                      placeholder="Enter your current password"
                    />
                  </div>
                  <FormInput
                    control={passwordForm.control}
                    name="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <FormInput
                    control={passwordForm.control}
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      passwordForm.reset();
                      setShowPasswordForm(false);
                    }}
                    disabled={isChangingPassword}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!passwordForm.formState.isValid || isChangingPassword}
                    className="min-w-[120px]"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
}
