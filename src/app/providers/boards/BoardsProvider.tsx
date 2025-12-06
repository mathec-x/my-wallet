'use client';

import useLocalStorage from '@/app/hooks/useLocalStorage.hook';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { Entry } from '../entries/EntriesType';

const BoardsContext = createContext<IBoardsContextType | undefined>(undefined);

interface BoardsProviderProps {
  entries: Entry[];
}

interface IBoard {
  id: number;
  uuid: string;
  name: string;
}

export interface IBoardsContextType {
  boards: IBoard[];
  board?: IBoard
  setBoard: (board?: IBoard) => void;
}

export function BoardsProvider({ children, entries }: React.PropsWithChildren<BoardsProviderProps>) {
  const [board, setBoard] = useLocalStorage<IBoard | undefined>('selected-board', undefined);

  const boards = useMemo(() => {
    const boards: IBoardsContextType['boards'] = [];
    entries.forEach(entry => {
      const boardId = entry.board?.id;
      if (boardId && !boards.find(b => b.id === boardId)) {
        boards.push({
          id: boardId,
          uuid: entry.board!.uuid,
          name: entry.board!.name
        });
      }
    });
    return boards.sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [entries]);

  useEffect(() => {
    if (board && !boards.find(b => b.uuid === board.uuid)) {
      setBoard(boards.length > 0 ? boards[boards.length - 1] : undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards, board]);


  return (
    <BoardsContext.Provider value={{
      boards,
      board,
      setBoard
    }}>{children}</BoardsContext.Provider>
  );
}

export function useBoardsContext() {
  const context = useContext(BoardsContext);
  if (context === undefined) {
    throw new Error('useBoardsContext must be used within an BoardsProvider');
  }
  return context;
}
