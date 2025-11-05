import { getCurrentUser } from '@/app/actions/user/user.actions';
import DocumentTitle from '@/app/components/elements/DocumentTitle';
import LinkButton from '@/app/components/primitives/LinkButton/LinkButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface HeaderProps {
  user: Awaited<ReturnType<typeof getCurrentUser>>;
}

const Header: React.FC<HeaderProps> = (props) => (
  <AppBar position="static">
    <Toolbar>
      <LinkButton href='/menu' scroll={false} sx={{ mr: 2 }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
      </LinkButton>
      <LinkButton href='/menu' variant='h5' sx={{ flexGrow: 1 }} aria-label='home'>
        <DocumentTitle />
      </LinkButton>
      {!props.user ? (
        <LinkButton href='/login' scroll={false} variant='button' aria-label='login'>
          Login
        </LinkButton>
      ) : (
        <Stack justifyContent='center'>
          <Typography variant='body1' component='h1'>
            {props.user.name}
          </Typography>
          <Typography variant='caption' color='textDisabled'>
            {props.user.email}
          </Typography>
        </Stack>
      )}
    </Toolbar>
  </AppBar>
);

export default Header;