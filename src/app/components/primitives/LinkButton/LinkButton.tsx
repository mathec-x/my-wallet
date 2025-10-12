import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

interface LinkButtonProps {
  children: React.ReactNode;
  href: string;
  scroll?: boolean;
  sx?: TypographyProps['sx'];
  variant?: TypographyProps['variant'];
}

const LinkButton: React.FC<LinkButtonProps> = (props) => {
  return (
    <Typography
      variant={props.variant || 'button'}
      component='div'
      sx={props.sx}>
      <Link
        color='inherit'
        href={props.href}
        scroll={props.scroll}
        style={{
          textDecoration: 'none', color: 'inherit'
        }}>
        {props.children}
      </Link>
    </Typography>
  );
};

export default LinkButton;
