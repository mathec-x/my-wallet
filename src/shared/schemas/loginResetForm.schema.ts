import z from 'zod';

export const loginResetFormSchema = z.object({
  email: z
    .email('Email inválido')
    .meta({
      title: 'Email',
      description: 'Seu email cadastrado',
      type: 'email',
      autoComplete: 'email',
    }),
});

export type LoginResetFormSchema = z.infer<typeof loginResetFormSchema>;
