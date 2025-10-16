'use client';

import { Entry } from '@/app/actions/entries/entries.actions';
import FullScreenModal from '@/app/components/elements/Modal';
import FormControlSchema from '@/app/components/primitives/Form/FormControlSchema';
import { EntryUpdateFormSchema, entryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FlexBox from '../../elements/FlexBox';

interface EntryFormProps {
  entry: Entry | undefined;
}

const EntryForm = ({ entry }: EntryFormProps) => {
  const handleUpdate = async (data: EntryUpdateFormSchema) => {
    console.log('handleUpdate', data);
  };

  return (
    <FullScreenModal
      name="entry"
      title={<>Editar <b>{entry?.title}</b></>}
      description={`Aqui você pode atualizar as informações da sua ${entry?.type === 'INCOME' ? 'entrada' : 'saída'}.`}>
      {entry ?
        <FormControlSchema
          id='form-entry-update'
          value={entry}
          onSubmit={handleUpdate}
          schema={entryUpdateFormSchema}
        >
          <Divider variant='fullWidth' sx={{ mt: 8 }} />
          <Button type='submit' form='form-entry-update' variant='contained' fullWidth>
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