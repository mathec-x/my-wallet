import { loginAction, registerAction } from '@/app/actions/login/login.actions';
import { ApplicationError } from '@/shared/ApplicationError/ApplicationError';
import { LoginFormSchema, LoginRegisterFormSchema, LoginResetFormSchema } from '@/shared/schemas';
import { useState } from 'react';

interface UseAuthenticationHandlersProps {
  onLoginSuccess?: (params: LoginFormSchema) => void;
  onRegisterSuccess?: (params: LoginRegisterFormSchema) => void;
}

export const useAuthenticationHandlers = (callbacks: UseAuthenticationHandlersProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    login: null as string | null,
    register: null as string | null
  });

  const handleLogin = async (params: LoginFormSchema) => {
    try {
      setLoading(true);
      await loginAction(params);
      setError({ ...error, login: null });
      callbacks.onLoginSuccess?.(params);
    } catch (err: unknown) {
      setError({ ...error, login: ApplicationError.handleError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (params: LoginRegisterFormSchema) => {
    try {
      setLoading(true);
      await registerAction(params);
      setError({ ...error, register: null });
      callbacks.onRegisterSuccess?.(params);
    } catch (err: unknown) {
      setError({ ...error, register: ApplicationError.handleError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (params: LoginResetFormSchema) => {
    alert('Não implementado ainda');
  };

  return {
    loading,
    error,
    handleLogin,
    handleRegister,
    handleReset
  };
};