'use client';

import SlidePanel from '@/app/components/elements/SlidePanel';
import FormControlSchema, { FormControlRef } from '@/app/components/primitives/Form/FormControlSchema';
import { useAuthHandlers } from '@/app/providers/auth/useAuthHandlers';
import {
  LoginFormSchema, loginFormSchema, LoginRegisterFormSchema, loginRegisterFormSchema,
  loginResetFormSchema
} from '@/shared/schemas';
import GitHubIcon from '@mui/icons-material/GitHub';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';

const LoginForm = () => {
  const [tab, setTab] = useState(0);
  const loginFormRef = useRef<FormControlRef<LoginFormSchema>>(null);
  const registerFormRef = useRef<FormControlRef<LoginRegisterFormSchema>>(null);
  const { error, handleLogin, handleRegister, handleReset, loading } = useAuthHandlers({
    onLoginSuccess: () => {
      console.log('login success, redirecting to home...');
      window.location.href = '/';
    },
    onRegisterSuccess: ({ email, password }) => {
      loginFormRef.current?.setValue('email', email);
      loginFormRef.current?.setValue('password', password);
      registerFormRef.current?.reset();
      setTab(0);
    },
    onResetPasswordSuccess: ({ email, newPassword }) => {
      loginFormRef.current?.setValue('email', email);
      loginFormRef.current?.setValue('password', newPassword);
      registerFormRef.current?.reset();
      setTab(0);
    },
  });

  return (
    <Box position={'relative'} sx={{ width: '100%', minHeight: 650, typography: 'body1' }}>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered onError={console.log}>
        <Tab label="Logar" />
        <Tab label="Registrar" />
        {tab === 2 && <Tab label="Redefinir" />}
      </Tabs>
      <SlidePanel direction='right' in={tab === 0}>
        <FormControlSchema
          ref={loginFormRef}
          schema={loginFormSchema}
          onSubmit={handleLogin}
          errorMessage={error.login}>
          <Box textAlign='center'>
            <Button loading={loading} type='submit' fullWidth variant="contained" sx={{ width: 250 }}>
              Entrar
            </Button>
          </Box>
        </FormControlSchema>
        <Box textAlign='center' mt={2}>
          <Typography variant="body2" color='primary.light' sx={{ mt: 2 }} gutterBottom>
            Esqueceu sua senha? <Button onClick={() => setTab(2)}>redefinir</Button>
          </Typography>
          <Typography variant="caption" color='text.secondary' sx={{ mt: 4 }}>
            Código fonte no <a href="https://github.com/mathec-x/my-wallet" target="_blank" rel="noopener noreferrer">GitHub</a>
          </Typography>
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'aliceblue', margin: '12px auto' }} variant='circular'>
            <GitHubIcon fontSize='large' color='primary' />
          </Avatar>
        </Box>
      </SlidePanel>
      <SlidePanel direction='left' in={tab === 1}>
        <FormControlSchema
          ref={registerFormRef}
          schema={loginRegisterFormSchema}
          onSubmit={handleRegister}
          errorMessage={error.register}>
          <Box textAlign='center'>
            <Button loading={loading} type='submit' fullWidth variant="contained" sx={{ mt: 4, width: 250 }}>
              Cadastrar
            </Button>
          </Box>
        </FormControlSchema>
      </SlidePanel>
      <SlidePanel direction={'left'} in={tab === 2}>
        <FormControlSchema
          schema={loginResetFormSchema}
          onSubmit={handleReset}
          errorMessage={error.reset}>
          <Box textAlign='center'>
            <Button loading={loading} type='submit' fullWidth variant="contained" sx={{ mt: 4, width: 250 }}>
              Enviar
            </Button>
          </Box>
        </FormControlSchema>
      </SlidePanel>
    </Box>
  );
};

export default LoginForm;