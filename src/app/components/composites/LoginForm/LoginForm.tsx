import { registerAction } from '@/app/actions/login/register.actions';
import FlexBox from '@/app/components/elements/FlexBox';
import SlidePanel from '@/app/components/elements/SlidePanel';
import FormControlSchema, { FormControlRef } from '@/app/components/primitives/Form/FormControlSchema';
import { ApplicationError } from '@/shared/ApplicationError/ApplicationError';
import {
  LoginFormSchema, loginFormSchema, LoginRegisterFormSchema, loginRegisterFormSchema, LoginResetFormSchema, loginResetFormSchema
} from '@/shared/schemas';
import GitHubIcon from '@mui/icons-material/GitHub';
import WalletIcon from '@mui/icons-material/Wallet';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleLogin = async (data: LoginFormSchema) => {
    console.log(data);
  };

  const handleRegister = async (data: LoginRegisterFormSchema) => {
    try {
      setLoading(true);
      await registerAction(data);
      loginFormRef.current?.setValue('email', data.email);
      loginFormRef.current?.setValue('password', data.password);
      registerFormRef.current?.reset();
      setError(undefined);
      setTab(0);
    } catch (error: unknown) {
      setError(ApplicationError.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (data: LoginResetFormSchema) => {
    console.log(data);
  };

  return (
    <FlexBox flexDirection='column' p={{ md: 4, xs: 1 }} overflow='hidden'>
      <Avatar sx={{ width: 56, height: 56, bgcolor: 'aliceblue' }}>
        <WalletIcon fontSize='large' color='info' />
      </Avatar>
      <Typography variant="button" fontSize='1.36rem' component="h1" color='primary.light' gutterBottom sx={{ mt: 2 }}>
        My Wallet
      </Typography>
      <Box position={'relative'} sx={{ width: '100%', minHeight: 550, typography: 'body1' }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered onError={console.log}>
          <Tab label="Logar" />
          <Tab label="Registrar" />
          {tab === 2 && <Tab label="Redefinir" />}
        </Tabs>
        <SlidePanel direction='right' in={tab === 0}>
          <FormControlSchema ref={loginFormRef} schema={loginFormSchema} onSubmit={handleLogin}>
            <Box textAlign='center'>
              <Button loading={loading} type='submit' fullWidth variant="contained" sx={{ mt: 4, width: 250 }}>
                Entrar
              </Button>
            </Box>
          </FormControlSchema>
          <Box textAlign='center' mt={8}>
            <Typography variant="body2" color='primary.light' sx={{ mt: 2 }} gutterBottom>
              Esqueceu sua senha? <Button onClick={() => setTab(2)} sx={{ ml: 2 }}>redefinir</Button>
            </Typography>
            <Typography variant="caption" color='text.secondary' sx={{ mt: 4, mb: 2 }} gutterBottom>
              Código fonte no <a href="https://github.com/my-wallet" target="_blank" rel="noopener noreferrer">GitHub</a>
            </Typography>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'aliceblue', margin: '32px auto' }}>
              <GitHubIcon fontSize='large' color='info' />
            </Avatar>
          </Box>
        </SlidePanel>
        <SlidePanel direction='left' in={tab === 1}>
          <FormControlSchema ref={registerFormRef} schema={loginRegisterFormSchema} onSubmit={handleRegister} error={error}>
            <Box textAlign='center'>
              <Button loading={loading} type='submit' fullWidth variant="contained" sx={{ mt: 4, width: 250 }}>
                Cadastrar
              </Button>
            </Box>
          </FormControlSchema>
        </SlidePanel>
        <SlidePanel direction={'left'} in={tab === 2}>
          <FormControlSchema schema={loginResetFormSchema} onSubmit={handleReset}>
            <Box textAlign='center'>
              <Button loading={loading} type='submit' fullWidth variant="contained" sx={{ mt: 4, width: 250 }}>
                Enviar
              </Button>
            </Box>
          </FormControlSchema>
        </SlidePanel>
      </Box>
    </FlexBox>
  );
};

export default LoginForm;