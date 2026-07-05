'use client';

import { MenuContext } from '@/app/components/elements';
import { useEntriesActions } from '@/app/providers/entries/EntriesActions';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import AddIcon from '@mui/icons-material/AddOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import MoreIcon from '@mui/icons-material/MoreVertOutlined';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useId, useLayoutEffect, useRef } from 'react';

export default function BoardsChip() {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const { boards, board, setBoard } = useEntriesContext();
  const { handleCloneBoard, handleDeleteBoard } = useEntriesActions();

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = ref.current.scrollWidth;
    }
  }, []);

  return boards.length > 0 &&
    <Stack direction='row' spacing={1} alignItems='center' mb={1} overflow='auto' py={1} ref={ref}
      sx={{
        // 1. Define a altura da barra horizontal
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        // 2. Estiliza o fundo da barra (trilho)
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
          borderRadius: '4px',
        },
        // 3. Estiliza o pegador (a barra que se move)
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px',
        },
        // 4. Efeito de hover no pegador
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#333',
        },
        // Firefox (suporte básico)
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 transparent',
      }}
    >
      {boards.map((b, i) => (
        <MenuContext
          key={id + b.name + i}
          header={`Ações do quadro ${b.name}`}
          childActionProp='onDelete'
          childProps={{
            deleteIcon: <MoreIcon />
          }}
          options={[
            { icon: AddIcon, label: 'Clonar', action: () => handleCloneBoard(b.uuid) },
            { icon: DeleteIcon, label: 'Deletar', action: () => handleDeleteBoard(b.uuid) },
          ]}>
          <Chip
            size='small'
            label={
              <Typography
                variant='subtitle2'
                fontSize={9}
                fontWeight={600}
                sx={{ borderRight: 1, pr: 1, borderColor: 'divider' }}>
                {b.name || '_______'}
              </Typography>
            }
            onClick={() => setBoard(b)}
            color='primary'
            variant={board?.uuid === b.uuid ? 'filled' : 'outlined'}
          />
        </MenuContext>
      ))}
    </Stack >;
}