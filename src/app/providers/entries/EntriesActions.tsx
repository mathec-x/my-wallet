import {
  boardCopyAction,
  boardCreateAction,
  boardDeleteAction,
  entriesCreateAction,
  entriesDeleteAction,
  entriesUpdateAction,
  subEntriesUpdateAction
} from '@/app/actions/entries/entries.actions';
import { MODALS } from '@/app/hooks/useModalHandler';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { usePromptWindow } from '../prompt/PromptProvider';
import { useEntriesContext } from './EntriesProvider';
import type { Entry, ENTRY_TYPE } from './EntriesType';

export const useEntriesActions = () => {
  const { entries, board, setBoard, setEntriesBoard, addEntries, findEntries, remove, restore, set, accountUuid } = useEntriesContext();
  const { confirm, alert, loading } = usePromptWindow();
  const params = useSearchParams();
  const entryUuid = params.get(MODALS.ENTRY_EDITOR);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [entry] = useMemo(() => !entryUuid ? [] : findEntries(e => e.uuid === entryUuid), [entryUuid]);

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
    loading('Deletando painel...');
    const res = await boardDeleteAction({ uuid: boardUUid });
    if (res.success) {
      setEntriesBoard(list.map(e => e.id));
    } else {
      alert(res.message || 'Erro ao deletar o painel');
    }
    loading(false);
  };

  const handleCloneBoard = async (boardUUid: string) => {
    const [{ board: selectedBoard }] = findEntries(e => e.board?.uuid === boardUUid);
    if (!selectedBoard) {
      alert('Painel não encontrado');
      return;
    }

    const confirmation = await confirm(
      'Clonar painel',
      `Deseja clonar o painel '${selectedBoard!.name || ''}' com todas as suas entradas?`,
    );
    if (!confirmation) {
      return;
    }
    loading(`Clonando painel '${selectedBoard!.name || '...'}'`);
    const res = await boardCopyAction({
      accountUuid: accountUuid,
      boardId: selectedBoard!.id,
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


  const handleSubmit = async (value: string, type: ENTRY_TYPE, callback?: (e: Entry) => void) => {
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
    if (newEntry.success) {
      addEntries([newEntry.data]);
      callback?.(newEntry.data);
    }
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
      const entryUuid = data?.uuid || entry!.uuid; // este é recebido via params caso nao venha do data;

      const { subEntries, ...parsed } = set((e) => e.uuid === entryUuid, data); // Optimistic UI update
      const sub = await subEntriesUpdateAction({
        entryUuid,
        subEntries: subEntries || []
      });

      if (!sub.success) {
        console.error(`Erro ao atualizar sub divisão ${sub.error}`);
      }

      const res = await entriesUpdateAction({
        accountUuid: accountUuid,
        entryUuid,
        data: parsed as never
      });
      if (res?.success) {
        set((e) => e.uuid === entryUuid, res.data);
      } else {
        restore();
      }
      return res;
    }, [accountUuid, entry, restore, set]);

  return {
    entry,
    handleBoardNameSubmit,
    handleDeleteBoard,
    handleShareBoard,
    handleCloneBoard,
    handleSubmit,
    handleDelete,
    handleUpdate
  };
};