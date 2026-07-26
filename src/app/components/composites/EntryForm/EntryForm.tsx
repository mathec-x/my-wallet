'use client';

import FullScreenModal from '@/app/components/elements/Modal';
import FormControlSchema from '@/app/components/primitives/Form/FormControlSchema';
import useModalHandler, { MODALS } from '@/app/hooks/useModalHandler';
import { useEntriesActions } from '@/app/providers/entries/EntriesActions';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import { categoriesList } from '@/shared/schemas/categoriesList';
import { EntryUpdateFormSchema, entryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { Sum } from '@/shared/utils/math';
import { floatToMoney } from '@/shared/utils/money-format';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTransition } from 'react';
import { ListContainer, ListItemAction, ListItemRow } from '../../elements';

const EntryForm = () => {
  const modal = useModalHandler(MODALS.ENTRY_EDITOR);
  const { handleUpdate: onUpdate, entry } = useEntriesActions();
  const [isPending, startTransition] = useTransition();

  const { entryService } = useEntriesContext();

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

  const creditCardItems = entryService.filterBy({ refCreditCardId: entry?.id });
  const availableCreditCards = entry?.boardId && entryService.board(entry.boardId).filterBy({ category: 'credit_card' });

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
          : `Aqui você pode atualizar as informações da sua ${entry?.type === 'INCOME' ? 'entrada' : entry?.type === 'EXPENSE' ? 'saída' : 'regra'}.`
      }>
      {entry ?
        <FormControlSchema
          id='form-entry-update'
          onSubmit={handleUpdate}
          schema={entryUpdateFormSchema}
          options={{
            refCreditCardId:
              (!!availableCreditCards && ['EXPENSE', 'TASK'].includes(entry.type) && entry.category !== 'credit_card') &&
              [{ label: 'Nenhum', value: null }, ...availableCreditCards.map(e => ({ label: e.title, value: e.id }))]
          }}
          value={{
            ...entry,
            amount: floatToMoney(entry.amount),
            expected: floatToMoney(entry.expected),
            subEntries: entry.subEntries?.map(subEntry => ({
              ...subEntry,
              amount: floatToMoney(subEntry.amount),
            }))
          }}>
          <ListContainer dense
            component='div'
            hide={!['EXPENSE', 'TASK'].includes(entry.type) || !creditCardItems || creditCardItems.length === 0}
            sx={{ my: 2 }}>
            <ListItemRow
              component="div"
              caption="Compras neste cartão"
              disableGutters
              secondaryAction={
                <Typography variant='caption' color='textDisabled'>
                  Total: R$ {floatToMoney(Sum(creditCardItems, 'amount') + entry.amount)}
                </Typography>
              } />
            {creditCardItems.map((e) =>
              <ListItemAction
                disableGutters
                disablePadding
                avatarVariant='hidden'
                key={e.uuid}
                component='div'
                sx={{ backgroundColor: 'transparent' }}
                SwipLeftLabel="Desvincular"
                onSwipeLeft={() => onUpdate({ refCreditCardId: null, uuid: e.uuid } as EntryUpdateFormSchema)}
                caption={categoriesList[e?.category as keyof typeof categoriesList]?.label}
                primary={e.title}
                secondary={e.description}>
                <Typography variant='caption'>+ R$ {floatToMoney(e.amount)}</Typography>
              </ListItemAction>
            )}
          </ListContainer>
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