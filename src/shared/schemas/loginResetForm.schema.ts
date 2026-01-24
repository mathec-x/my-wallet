import z from 'zod';
import { validationMessage } from './validationMessages';

export const loginResetFormSchema = z.object({
  email: z
    .email('Email inválido')
    .meta({
      title: 'Email',
      description: 'Seu email cadastrado',
      type: 'email',
      autoComplete: 'email',
    }),

  password: z
    .string()
    .min(6, { message: validationMessage('minLength', { min: 6 }) })
    .max(20, { message: validationMessage('maxLength', { max: 20 }) })
    .meta({
      title: 'Senha',
      description: 'Sua senha de acesso',
      type: 'password',
      autoComplete: 'new-password',
    }),

  newPassword: z
    .string()
    .min(6, { message: validationMessage('minLength', { min: 6 }) })
    .max(20, { message: validationMessage('maxLength', { max: 20 }) })
    .meta({
      title: 'Nova Senha',
      description: 'Sua nova senha de acesso',
      type: 'password',
      autoComplete: 'new-password'
    }),

  confirmPassword: z
    .string()
    .min(6, { message: validationMessage('minLength', { min: 6 }) })
    .max(20, { message: validationMessage('maxLength', { max: 20 }) })
    .meta({
      title: 'Confirmar Senha',
      description: 'Redigite sua senha',
      type: 'password',
      autoComplete: 'new-password'
    }),

  confirmationCode: z
    .string()
    .length(6, { message: validationMessage('required', { length: 6 }) })
    .meta({
      title: 'Código de Confirmação',
      description: 'Código enviado para o seu email',
      type: 'text',
      autoComplete: 'one-time-code',
    }),
})
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: validationMessage('passwordsDoNotMatch')
  });


export type LoginResetFormSchema = z.infer<typeof loginResetFormSchema>;
