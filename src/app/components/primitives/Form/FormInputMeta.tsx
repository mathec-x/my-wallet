'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Control, Controller, UseFormRegisterReturn } from 'react-hook-form';


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
  autoSelect?: boolean;
  control?: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: { label: string; value: string }[];
  autoComplete?: string;
  align?: 'left' | 'right' | 'center';
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
}
const FormInputMeta: React.FC<FormInputMetaProps> = ({
  fullWidth, label, title, error, helperText, form, inputMode, description, multiline, options, control, autoSelect,
  type = 'text', align = 'left', autoComplete
}) => {

  switch (type) {
    case 'checkbox':
      return (
        <Controller
          control={control}
          {...form}
          render={({ field: { onChange, value } }) => (
            <FormControlLabel
              disableTypography
              sx={{
                my: 2,
                userSelect: 'none',
                display: 'flex',
                flexDirection: align === 'right' ? 'row-reverse' : align === 'left' ? 'row' : 'column',
                lineHeight: 0,
                textAlign: align
              }}
              label={
                <Box mx={1}>
                  <Typography variant='body2'>{title || label}</Typography>
                  <Typography variant='caption' color='textDisabled'>{helperText || description}</Typography>
                </Box>
              }
              control={<Checkbox checked={Boolean(value)} onChange={onChange} />}
            />
          )}
        />
      );
    case 'select':
      return (
        <FormControl fullWidth={fullWidth} error={!!error} variant='standard' margin='normal' size='medium'>
          <InputLabel>{title || label}</InputLabel>
          <Controller
            control={control}
            {...form}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                value={value || ''}
                onChange={onChange}
                label={title || label}
              >
                {options?.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{helperText || description}</FormHelperText>
        </FormControl>
      );
    default:
      return (
        <FormControl fullWidth={fullWidth} error={!!error} variant='standard' margin='normal' size='medium'>
          {type === 'date'
            ? <InputLabel shrink>{title || label}</InputLabel>
            : <InputLabel>{title || label}</InputLabel>
          }
          <Input
            // variant="standard"
            // margin="normal"
            // size='medium'
            // fullWidth={fullWidth}
            // error={!!error}
            // label={title || label}
            // helperText={helperText || description}
            autoComplete={autoComplete}
            onFocus={(e) => autoSelect && e.target.select()}
            type={type || 'text'}
            multiline={multiline}
            slotProps={{
              input: {
                inputMode: inputMode,
              }
            }}
            {...form}
          />
          <FormHelperText>{helperText || description}</FormHelperText>
        </FormControl>
      );
  }
};

export default FormInputMeta;