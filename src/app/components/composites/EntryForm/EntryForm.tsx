'use client';

import { entriesUpdateAction, Entry } from '@/app/actions/entries/entries.actions';
import FullScreenModal from '@/app/components/elements/Modal';
import FormControlSchema from '@/app/components/primitives/Form/FormControlSchema';
import useModalHandler from '@/app/hooks/useModalHandler';
import { EntryUpdateFormSchema, entryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { floatToMoney } from '@/shared/utils/money-format';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTransition } from 'react';

interface EntryFormProps {
  editorModalName: string;
  entry: Entry | undefined;
  onUpdate: (data: EntryUpdateFormSchema) => ReturnType<typeof entriesUpdateAction>;
}

const EntryForm = ({ entry, editorModalName, onUpdate }: EntryFormProps) => {
  const modal = useModalHandler(editorModalName);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (data: EntryUpdateFormSchema) => {
    startTransition(async () => {
      const res = await onUpdate(data);
      if (res.success) {
        modal.close();
      } else {
        alert(res.message || 'Erro ao atualizar a entrada. Tente novamente mais tarde.');
      }
    });
  };

  return (
    <FullScreenModal
      name={modal.name}
      title={<>Editar <b>{entry?.title}</b></>}
      actions={<>
        <Button loading={isPending} type='submit' form='form-entry-update' variant='contained' fullWidth>
          Salvar
        </Button>
      </>}
      description={
        entry?.board?.name
          ? `Quadro "${entry.board.name}".`
          : `Aqui você pode atualizar as informações da sua ${entry?.type === 'INCOME' ? 'entrada' : 'saída'}.`
      }>
      {entry ?
        <FormControlSchema
          id='form-entry-update'
          value={{
            ...entry,
            amount: floatToMoney(entry.amount),
            expected: floatToMoney(entry.expected)
          }}
          onSubmit={handleUpdate}
          schema={entryUpdateFormSchema}
        >
          {/* <Divider variant='fullWidth' sx={{ mt: 8 }} /> */}
          {/* <Button loading={isPending} type='submit' form='form-entry-update' variant='contained' fullWidth>
            Salvar
          </Button> */}
        </FormControlSchema>
        : (
          <Stack minHeight={570} bgcolor='background.main'>
            Procurando ...
          </Stack>
        )
      }
    </FullScreenModal >
  );
};


export default EntryForm;