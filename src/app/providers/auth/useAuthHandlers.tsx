import { loginAction, registerAction } from '@/app/actions/login/login.actions';
import { LoginFormSchema, LoginRegisterFormSchema, LoginResetFormSchema } from '@/shared/schemas';
import { useState } from 'react';

interface UseAuthHandlersProps {
  onLoginSuccess?: (params: LoginFormSchema) => void;
  onRegisterSuccess?: (params: LoginRegisterFormSchema) => void;
}

export const useAuthHandlers = (callbacks?: UseAuthHandlersProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    login: null as string | null,
    register: null as string | null
  });

  const handleLogin = async (params: LoginFormSchema) => {
    setLoading(true);
    const res = await loginAction(params);
    if (res.success) {
      setError({ ...error, login: null });
      callbacks?.onLoginSuccess?.(params);
    } else {
      setError({ ...error, login: res.message });
    }
    setLoading(false);
  };

  const handleRegister = async (params: LoginRegisterFormSchema) => {
    setLoading(true);
    const res = await registerAction(params);
    if (res.success) {
      setError({ ...error, register: null });
      callbacks?.onRegisterSuccess?.(params);
    } else {
      setError({ ...error, register: res.message });
    }
    setLoading(false);
  };

  const handleReset = async (params: LoginResetFormSchema) => {
    console.log(params);
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