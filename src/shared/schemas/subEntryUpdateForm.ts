import z from 'zod';

export const subEntryUpdateFormSchema = z.object({
  uuid: z.string().optional(),
  title: z
    .string('Título é obrigatório')
    .meta({
      label: 'Nome da sub entrada',
      width: '75%',
      margin: 'none'
    }),
  amount: z
    .union([
      z.string().optional(),
      z.string().regex(/^\d+(\.\d{3})*,\d{2}$/, 'Valor deve ser no formato $.$$$,$$'),
      z.string().regex(/^\d+(\.\d{3})*$/, 'Valor deve ser no formato $.$$$'),
    ])
    .meta({
      label: 'Valor',
      type: 'text',
      variant: 'outlined',
      margin: 'none',
      inputMode: 'decimal',
      width: '25%'
    }),
}).meta({
  title: 'Subdivisões',
  description: 'Subdivisões dessa entrada',
  width: '100%'
});

export type SubEntryUpdateFormSchema = z.infer<typeof subEntryUpdateFormSchema> & { uuid?: string };
