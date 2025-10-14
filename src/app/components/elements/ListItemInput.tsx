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
  onSubmit: (value: string) => Promise<void>;
  onError?: () => void;
  fullWidth?: boolean;
  disablePadding?: boolean;
}

export const ListItemInput: React.FC<ListInputProps> = ({ onSubmit, onError, id, placeholder, fullWidth, disablePadding }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { value } = e.currentTarget.elements.namedItem(`${id}-name`) as HTMLInputElement;
    if (value.length > 3) {
      onSubmit(value);
    } else {
      onError?.();
    }
    e.currentTarget.reset();
  };

  return (
    <ListItem
      disablePadding={disablePadding}
      secondaryAction={
        <IconButton type='submit' form={`${id}-form`} aria-label='add account'>
          <SendIcon />
        </IconButton>
      }>
      <ListItemButton>
        <ListItemAvatar>
          <Avatar variant='default'>
            <AddBusinessIcon />
          </Avatar>
        </ListItemAvatar>
        <FormControl
          id={`${id}-form`}
          component='form'
          onSubmit={handleSubmit}
          autoComplete='off'
          fullWidth={fullWidth}>
          <InputBase name={`${id}-name`} placeholder={placeholder} />
        </FormControl>
      </ListItemButton>
    </ListItem>
  );
};