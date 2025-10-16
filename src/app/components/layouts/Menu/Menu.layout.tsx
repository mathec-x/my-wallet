'use client';

import { deleteAccountAction, registerAccountAction } from '@/app/actions/accounts/account.actions';
import FlexBox from '@/app/components/elements/FlexBox';
import ListContainer from '@/app/components/elements/ListContainer';
import ListItemInput from '@/app/components/elements/ListItemInput';
import { useAuthProvider } from '@/app/providers/auth/AuthProvider';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined';
import WalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { CircularProgress, IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

interface MenuLayoutProps {
  onClose: (path?: string) => void;
}

const MenuLayout: React.FC<MenuLayoutProps> = (props) => {
  const { user, setUserAccounts } = useAuthProvider();
  const handleSelect = (value: string) => {
    props.onClose('/dashboard/' + value);
  };

  if (!user) return null;

  const handleDelete = async (param: { uuid: string }) => {
    setUserAccounts(user.accounts.map(account => ({
      ...account,
      uuid: account.uuid === param.uuid ? '' : account.uuid
    })));
    const res = await deleteAccountAction({ accountUuid: param.uuid, userUuid: user.uuid });
    if (res?.success) {
      setUserAccounts(user.accounts.filter(account => account.uuid !== res.data.uuid));
    } else {
      alert(res?.error || 'Erro ao deletar conta');
      setUserAccounts(user.accounts);
    }
  };

  const handleAddAccount = async (value: string) => {
    setUserAccounts([...user.accounts, { name: value, uuid: '', balance: 0 }]);
    const res = await registerAccountAction({
      accountName: value,
      userUuid: user!.uuid
    });
    if (res?.success) {
      setUserAccounts([...user.accounts, res.data!]);
    } else {
      setUserAccounts([...user.accounts]);
    }
  };

  return (
    <FlexBox col alignItems='flex-start' justifyContent='space-between'>
      <ListContainer header={`${user.accounts.length} Contas Registradas`} disablePadding>
        {user.accounts.map(account => (
          <ListItem
            divider
            disablePadding
            key={account.uuid + account.name}
            secondaryAction={
              !account.uuid
                ? <CircularProgress size={15} />
                : <IconButton onClick={() => handleDelete(account)} aria-label='delete account'>
                  <DeleteIcon />
                </IconButton>}>
            <ListItemButton onClick={() => handleSelect(account.uuid)} disabled={!account.uuid}>
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
            <Avatar variant='default'>
              <AccountBalanceIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`R$ ${user.accounts.reduce((acc, account) => acc + account.balance, 0).toFixed(2)}`}
            secondary='Saldo Total'
          />
        </ListItem>
        <ListItemInput
          id='add-account'
          placeholder='Adicionar Conta ex: casa, empresa'
          onSubmit={handleAddAccount}
          onError={async () => {
            alert('Nome da conta deve ter mais de 3 caracteres');
          }}
        />
      </ListContainer>
    </FlexBox>
  );
};

export default MenuLayout;