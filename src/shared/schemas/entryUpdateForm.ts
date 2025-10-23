import z from 'zod';
import { categoriesOptions } from './categoriesList';

export const entryUpdateFormSchema = z.object({
  title: z
    .string('Título é obrigatório')
    .meta({
      label: 'Título',
      description: 'Nome do título',
    }),
  description: z
    .string()
    .optional()
    .nullable()
    .meta({
      label: 'Descrição',
      description: 'Descrição do título',
    }),
  amount: z
    .union([
      z.string().optional(),
      z.string().regex(/^\d+(\.\d{3})*,\d{2}$/, 'Valor deve ser no formato $.$$$,$$'),
      z.string().regex(/^\d+(\.\d{3})*$/, 'Valor deve ser no formato $.$$$'),
    ])
    .meta({
      label: 'Valor',
      description: 'Valor deve ser no formato $.$$$,¢¢ ou $,¢¢',
      type: 'text',
      inputMode: 'decimal',
      autoSelect: true
    }),
  expected: z
    .union([
      z.string().optional().nullable(),
      z.string().regex(/^\d+(\.\d{3})*,\d{2}$/, 'Valor deve ser no formato $.$$$,$$'),
      z.string().regex(/^\d+(\.\d{3})*$/, 'Valor deve ser no formato $.$$$'),
      // z.coerce.number()
    ])
    .meta({
      label: 'Valor Esperado',
      description: 'Valor esperado deve ser no formato $.$$$,¢¢ ou $,¢¢',
      type: 'text',
      inputMode: 'decimal',
      autoSelect: true
    }),
  order: z
    .coerce.number()
    .optional()
    .meta({
      label: 'Pagamento/Ordem',
      description: 'Dia do pagamento',
      type: 'text',
      inputMode: 'decimal',
    }),
  type: z
    .enum(['INCOME', 'EXPENSE'])
    .meta({
      label: 'Tipo',
      description: 'Tipo da entrada de dinheiro',
      type: 'select',
      options: [
        { label: 'Entrada', value: 'INCOME' },
        { label: 'Saída', value: 'EXPENSE' },
      ]
    }),
  category: z
    .string()
    .optional()
    .nullable()
    .transform(e => e || '')
    .meta({
      label: 'Categoria',
      description: 'Atribua uma categoria para essa entrada',
      type: 'select',
      options: categoriesOptions
    }),
  future: z
    .boolean()
    .optional()
    .meta({
      label: 'Entrada/Saída futura',
      description: 'Marcar como a receber/a pagar',
      type: 'checkbox',
      align: 'right'
    }),
});

export type EntryUpdateFormSchema = z.infer<typeof entryUpdateFormSchema> & { uuid?: string };
