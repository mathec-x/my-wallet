'use client';

import AddBusinessIcon from '@mui/icons-material/AddBusinessOutlined';
import SendIcon from '@mui/icons-material/SendOutlined';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import { useState } from 'react';

export interface ListInputProps {
  id: string;
  placeholder: string;
  disablePadding?: boolean;
  icon?: React.ReactNode;
  value?: string;
  hide?: boolean;
  onSubmit: (value: string) => Promise<string | void>;
  onError?: (value?: string) => Promise<void>;
}

const ListItemInput: React.FC<ListInputProps> = ({ onSubmit, onError, id, placeholder, icon, value: defaultValue, hide, disablePadding = true }) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(defaultValue || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    if (value.length > 2 && value !== defaultValue) {
      const newvalue = await onSubmit(value);
      setValue(newvalue || '');
    } else {
      await onError?.(value);
    }
    setPending(false);
  };

  if (hide) {
    return null;
  }

  return (
    <ListItem
      disablePadding={disablePadding}
      // component='label'
      onSelect={e => e.preventDefault()}
    >
      <ListItemButton>
        <ListItemAvatar>
          <Avatar variant='default'>
            {pending ? <CircularProgress size={20} /> : icon || <AddBusinessIcon />}
          </Avatar>
        </ListItemAvatar>
        <FormControl
          disabled={pending}
          id={`${id}-form`}
          component='form'
          onSubmit={handleSubmit}
          autoComplete='off'
          fullWidth>
          <InputBase name={`${id}-name`} placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} />
        </FormControl>
        <IconButton type='submit' form={`${id}-form`} aria-label='add account' disabled={pending}>
          <SendIcon />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );
};

export default ListItemInput;