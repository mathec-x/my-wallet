import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';


interface FormInputMetaProps {
  form: UseFormRegisterReturn<string>
  fullWidth?: boolean;
  label?: string;
  title?: string;
  type?: string;
  error?: boolean;
  helperText?: string;
  description?: string;
  multiline?: boolean;
  options?: { label: string; value: string }[];
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
}
const FormInputMeta: React.FC<FormInputMetaProps> = ({
  fullWidth, label, title, type = 'text', error, helperText, form, inputMode, description, multiline, options
}) => {
  switch (type) {
    case 'checkbox':
      return (
        <FormControlLabel
          sx={{
            my: 2,
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'row-reverse',
            lineHeight: 0,
            textAlign: 'right'
          }}
          disableTypography
          label={
            <Box mx={1}>
              <Typography variant='body2'>{title || label}</Typography>
              <Typography variant='caption' color='textDisabled'>{helperText || description}</Typography>
            </Box>
          }
          control={<Checkbox defaultChecked />}
          {...form}
        />
      );
    case 'select':
      return (
        <FormControl fullWidth={fullWidth} error={!!error} variant='standard' margin='normal' size='medium'>
          <InputLabel>{title || label}</InputLabel>
          <Select {...form}>
            {options?.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{helperText || description}</FormHelperText>
        </FormControl>
      );
    default:
      return (
        <TextField
          variant="standard"
          margin="normal"
          size='medium'
          label={title || label}
          type={type || 'text'}
          fullWidth={fullWidth}
          error={!!error}
          helperText={helperText || description}
          multiline={multiline}
          slotProps={{
            inputLabel: type === 'date' ? { shrink: true } : {},
            htmlInput: {
              inputMode: inputMode,
            }
          }}
          {...form}
        />
      );
  }
};

export default FormInputMeta;