import { registerAccountAction } from '@/app/actions/accounts/registerAccount.actions';
import { ListContainer } from '@/app/components/elements/ListContainer';
import { useAuthProvider } from '@/app/providers/auth/AuthProvider';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined';
import WalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddBusinessIcon from '@mui/icons-material/AddBusinessOutlined';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import FlexBox from '../../elements/FlexBox';

const MenuLayout = () => {
  const { user, setUser } = useAuthProvider();

  if (!user) return null;

  const handleAddAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { value } = e.currentTarget.elements.namedItem('add-account-name') as HTMLInputElement;
    e.currentTarget.reset();
    const newAccount = await registerAccountAction({
      accountName: value,
      userUuid: user!.uuid
    });
    if (user && newAccount?.success) {
      setUser({ ...user, accounts: [...user.accounts, newAccount.data!] });
    }
  };

  return (
    <FlexBox col alignItems='flex-start' justifyContent='space-between'>
      <ListContainer header={`${user.accounts.length} Contas Registradas`} disablePadding>
        {user.accounts.map(account => (
          <ListItem key={account.uuid} divider disablePadding>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar>
                  <WalletIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={account.name} secondary={`R$ ${account.balance.toFixed(2)}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </ListContainer>
      <ListContainer header='Opções' disablePadding>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountBalanceIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`R$ ${user.accounts.reduce((acc, account) => acc + account.balance, 0).toFixed(2)}`}
            secondary='Saldo Total'
          />
        </ListItem>
        <ListItem disablePadding secondaryAction={
          <IconButton type='submit' form='add-account-form' aria-label='add account'>
            <AddBusinessIcon />
          </IconButton>
        }>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar>
                <AddBusinessIcon />
              </Avatar>
            </ListItemAvatar>
            <FormControl
              id='add-account-form'
              component='form'
              onSubmit={handleAddAccount}
              autoComplete='off'
              fullWidth>
              <InputBase name='add-account-name' placeholder='Adicionar Conta ex: casa, empresa' />
            </FormControl>
          </ListItemButton>
        </ListItem>
      </ListContainer>
    </FlexBox>
  );
};

export default MenuLayout;