import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { emailJSService, type EmailParams } from './EmailJSService';

export interface UseEmailJSOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}
export const useEmailJS = (options: UseEmailJSOptions = {}) => {
  const {
    successMessage = 'Email sent successfully!',
    errorMessage = 'Failed to send email. Please try again.',
    onSuccess
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendGeneralEmail = useCallback(
    async (templateId: string, templateParams: EmailParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await emailJSService.sendGeneralEmail(templateId, templateParams);
        // toast.success(successMessage);
        onSuccess?.();
        return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : errorMessage;
        setError(errorMsg);
        toast.error(errorMsg);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [successMessage, errorMessage, onSuccess]
  );
  return {
    isLoading,
    error,
    sendGeneralEmail
  };
};

export default useEmailJS;
