import AddBusinessIcon from '@mui/icons-material/AddBusinessOutlined';
import SendIcon from '@mui/icons-material/SendOutlined';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

export interface ListInputProps {
  id: string;
  placeholder: string;
  disablePadding?: boolean;
  icon?: React.ReactNode;
  onSubmit: (value: string) => Promise<void>;
  onError?: (value?: string) => Promise<void>;
}

const ListItemInput: React.FC<ListInputProps> = ({ onSubmit, onError, id, placeholder, icon, disablePadding = true }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { value } = e.currentTarget.elements.namedItem(`${id}-name`) as HTMLInputElement;
    e.currentTarget.reset();
    if (value.length > 2) {
      await onSubmit(value);
    } else {
      await onError?.(value);
    }
  };

  return (
    <ListItem
      disablePadding={disablePadding}
      component='label'
      secondaryAction={
        <IconButton type='submit' form={`${id}-form`} aria-label='add account'>
          <SendIcon />
        </IconButton>
      }>
      <ListItemButton>
        <ListItemAvatar>
          <Avatar variant='default'>
            {icon || <AddBusinessIcon />}
          </Avatar>
        </ListItemAvatar>
        <FormControl
          id={`${id}-form`}
          component='form'
          onSubmit={handleSubmit}
          autoComplete='off'
          fullWidth>
          <InputBase name={`${id}-name`} placeholder={placeholder} />
        </FormControl>
      </ListItemButton>
    </ListItem>
  );
};

export default ListItemInput;