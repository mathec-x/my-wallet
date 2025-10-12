import { Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormSingleInputProps {
  form: UseFormRegisterReturn<string>
  fullWidth?: boolean;
  label: string;
  type?: string;
  error?: boolean;
  helperText?: string;
}
const FormSingleInput: React.FC<FormSingleInputProps> = ({
  fullWidth, label, type = 'text', error, helperText, form
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
              <Typography variant='body2'>{label}</Typography>
              <Typography variant='caption' color='textDisabled'>{helperText}</Typography>
            </Box>
          }
          control={<Checkbox defaultChecked />}
          {...form}
        />
      );
    default:
      return (
        <TextField
          variant="standard"
          margin="normal"
          size='medium'
          label={label}
          type={type || 'text'}
          fullWidth={fullWidth}
          error={!!error}
          helperText={helperText}
          {...form}
        />
      );
  }
};

export default FormSingleInput;