'use client';

import AddBusinessIcon from '@mui/icons-material/AddBusinessOutlined';
import SendIcon from '@mui/icons-material/SendOutlined';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ListItem, { type ListItemProps } from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import { useEffect, useRef, useState } from 'react';

export interface ListInputProps {
  id: string;
  placeholder: string;
  disablePadding?: boolean;
  icon?: React.ReactNode;
  value?: string;
  hide?: boolean;
  autoSelect?: boolean;
  component?: ListItemProps['component'];
  sx?: ListItemProps['sx'];
  onSubmit: (value: string) => Promise<string | void>;
  onError?: (value?: string) => Promise<void>;
}

const ListItemInputFullScreen: React.FC<ListInputProps> = ({
  onSubmit,
  onError,
  id,
  placeholder,
  icon,
  value: defaultValue,
  hide,
  autoSelect,
  sx,
  component = 'li',
  disablePadding = true
}) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(defaultValue || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const [focus, setFocus] = useState(false);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (autoSelect) {
      e.target.select();
    }
    setTimeout(() => setFocus(true), 255);
  };

  useEffect(() => {
    const handleResize = () => {
      const isKeyboardOpen = (window.visualViewport?.height || window.innerHeight) < window.innerHeight;
      if (!isKeyboardOpen && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

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
      component={component}
      sx={{
        willChange: 'position, width, height, top, paddingTop, background-color, alignItems',
        transition: '0.15s ease-in-out',
        ...sx,
        '@media (max-device-width: 1024px)': {
          ...(focus ? {
            zIndex: 999999,
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            bgcolor: 'background.paper',
            alignItems: 'start',
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
            padding: '12px 0',
          } : {}),
        },
      }}
    // onSelect={(e) => e?.preventDefault()}
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
          <InputBase
            inputRef={inputRef}
            onFocus={handleInputFocus}
            onBlur={() => setFocus(false)}
            onKeyUp={e => {
              if (['Escape'].includes(e.key) && inputRef.current) {
                inputRef.current.blur();
              }
            }}
            name={`${id}-name`}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
          />
        </FormControl>
        <IconButton type='submit' form={`${id}-form`} aria-label='add account' disabled={pending}>
          <SendIcon />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );
};

export default ListItemInputFullScreen;