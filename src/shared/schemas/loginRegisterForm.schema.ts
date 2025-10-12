import z from 'zod';
import { validationMessage } from './validationMessages';

export const loginRegisterFormSchema = z.object({
  name: z
    .string()
    .min(6, { message: validationMessage('minLength', { min: 3 }) })
    .max(70, { message: validationMessage('maxLength', { max: 70 }) })
    .meta({
      title: 'Nome',
      description: 'Seu nome completo',
      type: 'text',
    }),
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
  confirmPassword: z
    .string()
    .min(6, { message: validationMessage('minLength', { min: 6 }) })
    .max(20, { message: validationMessage('maxLength', { max: 20 }) })
    .meta({
      title: 'Confirmar Senha',
      description: 'Redigite sua senha',
      type: 'password'
    })
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: validationMessage('passwordsDoNotMatch')
});

export type LoginRegisterFormSchema = z.infer<typeof loginRegisterFormSchema>;
