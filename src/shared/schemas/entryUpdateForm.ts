import z from 'zod';

export const entryUpdateFormSchema = z.object({
  title: z
    .string()
    .meta({
      label: 'Título',
      description: 'Nome do título',
    }),
  description: z
    .string()
    .nullable()
    .meta({
      label: 'Descrição',
      description: 'Descrição do título',
    }),
  amount: z
    .union([
      z.coerce.string(),
      z.string().regex(/^\d+(\.\d{3})*,\d{2}$/, 'Valor deve ser no formato $.$$$,$$'),
      z.string().regex(/^\d+(\.\d{3})*$/, 'Valor deve ser no formato $.$$$'),
    ])
    .meta({
      label: 'Valor',
      description: 'Valor deve ser no formato $.$$$,$$ ou $,$$',
      type: 'text',
      inputMode: 'decimal',
    }),
  date: z
    .string()
    .nullable()
    .meta({
      label: 'Data',
      description: 'Data de saída ou entrada',
      type: 'date',
      shrink: true,
    }),
  type: z
    .string()
    .optional()
    .meta({
      label: 'Tipo',
      description: 'Tipo do título',
      type: 'select',
      options: [
        { label: 'Entrada', value: 'INCOME' },
        { label: 'Saída', value: 'EXPENSE' },
      ]
    }),
});

export type EntryUpdateFormSchema = z.infer<typeof entryUpdateFormSchema>;
