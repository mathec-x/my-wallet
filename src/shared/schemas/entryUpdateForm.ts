import z from 'zod';

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
      z.string().regex(/^\d+(\.\d{3})*,\d{2}$/, 'Valor deve ser no formato $.$$$,$$'),
      z.string().regex(/^\d+(\.\d{3})*$/, 'Valor deve ser no formato $.$$$'),
    ])
    .optional()
    .meta({
      label: 'Valor',
      description: 'Valor deve ser no formato $.$$$,¢¢ ou $,¢¢',
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
      type: 'number'
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
      label: 'Tag',
      description: 'Atribua uma categoria para essa entrada',
      type: 'select',
      options: [
        { label: 'Sem Categoria', value: null },
        { label: 'Alimentação', value: 'food' },
        { label: 'Casa', value: 'house' },
        { label: 'Educação', value: 'education' },
        { label: 'Imposto', value: 'tax' },
        { label: 'Investimento', value: 'investment' },
        { label: 'Lazer', value: 'fun' },
        { label: 'Presente', value: 'gift' },
        { label: 'Saúde', value: 'health' },
        { label: 'Trabalho', value: 'work' },
        { label: 'Transporte', value: 'transport' },
        { label: '...Outros', value: '' },
      ]
    }),
  future: z
    .boolean()
    .meta({
      label: 'Entrada/Saída futura',
      description: 'Marcar como a receber/a pagar',
      type: 'checkbox',
    }),
});

export type EntryUpdateFormSchema = z.infer<typeof entryUpdateFormSchema> & { uuid?: string };
