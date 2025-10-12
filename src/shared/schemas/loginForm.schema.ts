import z from 'zod';
import { validationMessage } from './validationMessages';

export const loginFormSchema = z.object({
  email: z
    .email('Email inválido')
    .meta({
      title: 'Email',
      description: 'Seu email cadastrado',
      type: 'email',
    }),
  password: z
    .string()
    .min(6, { message: validationMessage('minLength', { min: 6 }) })
    .max(20, { message: validationMessage('maxLength', { max: 20 }) })
    .meta({
      title: 'Senha',
      description: 'Sua senha de acesso',
      type: 'password'
    }),
  remeberMe: z
    .boolean()
    .meta({
      title: 'Lembrar-me',
      description: 'Mantenha-me conectado neste dispositivo',
      type: 'checkbox'
    }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
