'use client';

import { entriesUpdateAction, Entry } from '@/app/actions/entries/entries.actions';
import FullScreenModal from '@/app/components/elements/Modal';
import FormControlSchema from '@/app/components/primitives/Form/FormControlSchema';
import useModalHandler from '@/app/hooks/useModalHandler';
import { EntryUpdateFormSchema, entryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { floatToMoney } from '@/shared/utils/money-format';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useState, useTransition } from 'react';
import FlexBox from '../../elements/FlexBox';

interface EntryFormProps {
  editorModalName: string;
  entry: Entry | undefined;
  onUpdate: (data: EntryUpdateFormSchema) => ReturnType<typeof entriesUpdateAction>;
}

const EntryForm = ({ entry, editorModalName, onUpdate }: EntryFormProps) => {
  const modal = useModalHandler(editorModalName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (data: EntryUpdateFormSchema) => {
    startTransition(async () => {
      const res = await onUpdate(data);
      if (res.success) {
        setError(null);
        modal.close();
      } else {
        setError(res.message || 'Erro ao atualizar a entrada. Tente novamente mais tarde.');
      }
    });
  };

  return (
    <FullScreenModal
      name={modal.name}
      title={<>Editar <b>{entry?.title}</b></>}
      description={`Aqui você pode atualizar as informações da sua ${entry?.type === 'INCOME' ? 'entrada' : 'saída'}.`}>
      {entry ?
        <FormControlSchema
          id='form-entry-update'
          value={{
            ...entry,
            amount: floatToMoney(entry.amount)
          }}
          onSubmit={handleUpdate}
          schema={entryUpdateFormSchema}
          errorMessage={error}
        >
          <Divider variant='fullWidth' sx={{ mt: 8 }} />
          <Button loading={isPending} type='submit' form='form-entry-update' variant='contained' fullWidth>
            Atualizar
          </Button>
        </FormControlSchema>
        : (
          <FlexBox minHeight={570} bgcolor='background.main'>
            Procurando ...
          </FlexBox>
        )
      }
    </FullScreenModal >
  );
};


export default EntryForm;