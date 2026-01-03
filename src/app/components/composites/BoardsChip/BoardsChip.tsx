'use client';

import useLocalStorage, { STORAGE } from '@/app/hooks/useLocalStorage.hook';
import { useEntriesActions } from '@/app/providers/entries/EntriesActions';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import AddIcon from '@mui/icons-material/AddOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import UnlockIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/LockOutline';
import ShareIcon from '@mui/icons-material/Share';
import Chip from '@mui/material/Chip';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useId } from 'react';

const GrowContent = styled('div')<{ width?: number, flex?: boolean }>(({ theme, width, flex }) => ({
  width,
  display: flex ? 'flex' : 'block',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function BoardsChip() {
  const id = useId();
  const [lock, setLock] = useLocalStorage(STORAGE.LOCK_BOARD, true);
  const { boards, board, setBoard } = useEntriesContext();
  const { handleCloneBoard, handleDeleteBoard, handleShareBoard } = useEntriesActions();
  return boards.length > 0 &&
    <Stack direction='row' spacing={1} alignItems='center' mb={1} overflow='auto' py={1}>
      <IconButton onClick={() => setLock(!lock)} color={lock ? 'primary' : 'secondary'}>
        {lock ? <LockIcon /> : <UnlockIcon />}
      </IconButton>
      <Grow in={!lock}>
        <GrowContent width={!lock ? 80 : 1} flex>
          <IconButton onClick={() => handleShareBoard()} color='primary' disabled={!board?.id}>
            <ShareIcon />
          </IconButton>
          <IconButton onClick={() => handleCloneBoard()} color='primary' disabled={!board?.id}>
            <AddIcon />
          </IconButton>
        </GrowContent>
      </Grow>
      {boards.map((b, i) => (
        <Chip
          key={id + b.name + i}
          label={<Typography variant='subtitle2'>{b.name || '_______'}</Typography>}
          deleteIcon={<DeleteIcon sx={{ mx: 1 }} />}
          onDelete={!lock ? () => handleDeleteBoard(b.uuid) : undefined}
          onClick={() => setBoard(b)}
          color='primary'
          variant={board?.uuid === b.uuid ? 'filled' : 'outlined'}
        />
      ))}
    </Stack >;
}