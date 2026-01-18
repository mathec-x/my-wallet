import Box from '@mui/material/Box';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';

interface TabActionProps {
  options: {
    label?: TabProps['label'],
    icon?: TabProps['icon']
    onSelect: () => void
  }[]
}

const TabAction: React.FC<TabActionProps> = (props) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    props.options[newValue].onSelect();
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange} variant='fullWidth'>
        {props.options.map((option, index) => (
          <Tab
            key={index}
            label={option.label}
            icon={option.icon}
            sx={option.icon ? { maxWidth: 0 } : {}}
          />
        ))}
      </Tabs>
    </Box>
  );
};


export default TabAction;