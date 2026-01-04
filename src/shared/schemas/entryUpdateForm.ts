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
      autoSelect: true,
      width: '40%'
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
      type: 'text',
      inputMode: 'decimal',
      autoSelect: true,
      width: '40%'
    }),
  order: z
    .coerce.number()
    .optional()
    .meta({
      label: 'Dia',
      autoSelect: true,
      type: 'text',
      inputMode: 'decimal',
      width: '20%'
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
  type: z
    .enum(['INCOME', 'EXPENSE'])
    .meta({
      label: 'Tipo',
      description: 'Tipo da entrada de dinheiro',
      type: 'choice',
      options: [
        { label: 'Entrada', value: 'INCOME' },
        { label: 'Saída', value: 'EXPENSE' },
      ]
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
