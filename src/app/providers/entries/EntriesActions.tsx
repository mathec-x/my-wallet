import { boardCopyAction, boardCreateAction, boardDeleteAction } from '@/app/actions/entries/entries.actions';
import { usePromptWindow } from '../prompt/PromptProvider';
import { useEntriesContext } from './EntriesProvider';

export const useEntriesActions = (accountUuid: string) => {
  const { entries, board, setBoard, setEntriesBoard, addEntries, findEntries } = useEntriesContext();
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

  return {
    handleBoardNameSubmit,
    handleDeleteBoard,
    handleShareBoard,
    handleCloneBoard
  };
};