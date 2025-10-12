import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
}));

export default FlexBox;