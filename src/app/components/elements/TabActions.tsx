import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';

interface TabActionProps {
  hide?: boolean
  options: {
    label?: TabProps['label'],
    icon?: TabProps['icon']
    onSelect: () => void
  }[]
}

const TabAction: React.FC<TabActionProps> = (props) => {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  // Detecta se a tela é menor que o breakpoint 'sm' (600px)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    props.options[newValue].onSelect();
  };

  return !props.hide && (
    <Box>
      <Tabs value={value} onChange={handleChange} variant='scrollable'>
        {props.options.map((option, index) => (
          <Tab
            key={index}
            label={option.label}
            icon={option.icon}
            iconPosition={isMobile ? 'bottom' : 'start'}
            sx={{
              fontSize: '0.875rem', // Equivalente a 14px (o padrão é 1rem)
              textTransform: 'none' // Evita que o texto fique todo em maiúsculo  
            }}
          // sx={option.icon ? { maxWidth: 0 } : {}}
          />
        ))}
      </Tabs>
    </Box>
  );
};


export default TabAction;