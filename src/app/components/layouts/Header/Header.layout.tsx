import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { cookies } from 'next/headers';
import LinkButton from '../../primitives/LinkButton/LinkButton';

const Header = async () => {
  const cookStore = await cookies();
  const token = cookStore.get('auth')?.value;

  return (
    <AppBar position="static">
      <Toolbar>
        <LinkButton href='/menu' scroll={false} sx={{ mr: 2 }}>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </LinkButton>
        <LinkButton href='/menu' variant='h5' sx={{ flexGrow: 1 }} aria-label='home'>
          My Wallet
        </LinkButton>
        {!token &&
          <LinkButton href='/login' scroll={false} variant='button' aria-label='login'>
            Login
          </LinkButton>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Header;