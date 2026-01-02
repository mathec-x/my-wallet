import {
  boardCopyAction,
  boardCreateAction,
  boardDeleteAction,
  entriesCreateAction,
  entriesDeleteAction,
  entriesUpdateAction
} from '@/app/actions/entries/entries.actions';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { useCallback } from 'react';
import { usePromptWindow } from '../prompt/PromptProvider';
import { useEntriesContext } from './EntriesProvider';
import { Entry } from './EntriesType';

export const useEntriesActions = (accountUuid: string, entry?: Entry) => {
  const { entries, board, setBoard, setEntriesBoard, addEntries, findEntries, remove, restore, set } = useEntriesContext();
  const { confirm, alert, loading } = usePromptWindow();

  const handleBoardNameSubmit = async (value: string) => {
    const res = await boardCreateAction({
      accountUuid: accountUuid,
      boardId: board?.id || 0,
      boardName: value,
      entriesIds: entries.map(e => e.id),
    });
    if (res.success) {
      const entriesIds = entries.map(e => e.id);
      setEntriesBoard(entriesIds, {
        id: res.data.id,
        uuid: res.data.uuid,
        name: res.data.name,
      });
    } else {
      alert(res.message || 'Erro ao nomear o painel');
    }
  };

  const handleDeleteBoard = async (boardUUid: string) => {
    const list = findEntries(e => e.board?.uuid === boardUUid);
    const confirmation = await confirm(
      'Atenção! Esta ação não pode ser desfeita.',
      `Tem certeza que deseja deletar o painel ${list[0].board?.name} com ${list.length} entradas vinculadas? essas entradas serão deletadas.`,
    );
    if (!confirmation) {
      return;
    }
    loading(true, 'Deletando painel...');
    const res = await boardDeleteAction({ uuid: boardUUid });
    if (res.success) {
      setEntriesBoard(list.map(e => e.id));
    } else {
      alert(res.message || 'Erro ao deletar o painel');
    }
    loading(false);
  };

  const handleCloneBoard = async () => {
    const confirmation = await confirm(
      'Clonar painel',
      `Deseja clonar o painel '${board!.name || ''}' com todas as suas entradas?`,
    );
    if (!confirmation) {
      return;
    }
    loading(true, `Clonando painel '${board!.name || '...'}'`);
    const res = await boardCopyAction({
      accountUuid: accountUuid,
      boardId: board!.id,
    });
    if (res.success) {
      addEntries(res.data);
      setBoard(res.data[0].board!);
    } else {
      alert(res.message || 'Erro ao clonar o painel');
    }
    loading(false);
  };

  const handleShareBoard = async () => {
    alert('Em breve você poderá compartilhar seus painéis com outras pessoas!');
  };


  const handleSubmit = async (value: string, type: 'INCOME' | 'EXPENSE') => {
    const newEntry = await entriesCreateAction({
      accountUuid: accountUuid,
      data: {
        title: value,
        type: type,
        board: !board?.id ? undefined : {
          connect: { id: board.id }
        }
      }
    });
    addEntries(newEntry.success ? [newEntry.data] : undefined);
  };

  const handleDelete = async (param: { uuid: string }) => {
    remove({ uuid: param.uuid }); // Optimistic UI update
    const res = await entriesDeleteAction({ entryUuid: param.uuid, accountUuid: accountUuid });
    if (!res.success) {
      restore();
    }
  };

  const handleUpdate = useCallback(
    async (data: EntryUpdateFormSchema) => {
      const parsed = set((e) => e.uuid === (entry?.uuid || data.uuid), data); // Optimistic UI update
      const res = await entriesUpdateAction({
        accountUuid: accountUuid,
        entryUuid: data?.uuid || entry!.uuid,
        data: parsed as never,
      });
      if (res?.success) {
        set((e) => e.uuid === (entry?.uuid || data.uuid), res.data);
      } else {
        restore();
      }
      return res;
    }, [accountUuid, entry, restore, set]);

  return {
    handleBoardNameSubmit,
    handleDeleteBoard,
    handleShareBoard,
    handleCloneBoard,
    handleSubmit,
    handleDelete,
    handleUpdate
  };
};