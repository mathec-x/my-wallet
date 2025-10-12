import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import LinkButton from '../../primitives/LinkButton/LinkButton';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <LinkButton href='/menu' sx={{ mr: 2 }}>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </LinkButton>
        <LinkButton href='/' variant='h5' sx={{ flexGrow: 1 }} aria-label='home'>
          My Wallet
        </LinkButton>
        <LinkButton href='/login' scroll={false} variant='button' aria-label='login'>
          Login
        </LinkButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;