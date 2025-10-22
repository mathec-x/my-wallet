'use client';
import Box, { type BoxProps } from '@mui/material/Box';

interface FlexBoxProps extends BoxProps {
  col?: boolean
}
/**
 * @use mui Stack
 */
const FlexBox: React.FC<FlexBoxProps> = ({ col, ...boxProps }) => {
  return (
    <Box
      flexDirection={col ? 'column' : 'row'}
      display='flex'
      alignItems='center'
      justifyContent='center'
      bgcolor={(theme) => theme.palette.background.paper}
      height='100%'
      width='100%'
      boxSizing='border-box'
      {...boxProps}
    />
  );
};

export default FlexBox;