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
import { useId } from 'react';

export default function BoardsChip() {
  const id = useId();
  const { boards, board, setBoard } = useEntriesContext();
  const { handleCloneBoard, handleDeleteBoard } = useEntriesActions();
  return boards.length > 0 &&
    <Stack direction='row' spacing={1} alignItems='center' mb={1} overflow='auto' py={1}>
      {boards.map((b, i) => (
        <MenuContext
          key={id + b.name + i}
          header={`Ações do quadro ${b.name}`}
          childProps={{
            actionProp: 'onDelete',
            deleteIcon: <MoreIcon />
          }}
          options={[
            { icon: AddIcon, label: 'Clonar', action: () => handleCloneBoard(b.uuid) },
            { icon: DeleteIcon, label: 'Deletar', action: () => handleDeleteBoard(b.uuid) },
          ]}>
          <Chip
            label={
              <Typography
                variant='subtitle2'
                sx={{ borderRight: 1, pr: 1.5, borderColor: 'divider' }}>
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