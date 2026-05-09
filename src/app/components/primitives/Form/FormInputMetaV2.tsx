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
import { type ControllerRenderProps } from 'react-hook-form';
import InputVisibilityAdornment from './InputVisibilityAdornment';

interface FormInputMetaProps {

  form: ControllerRenderProps<Record<string, unknown>, string>
  fullWidth?: boolean;
  label?: string;
  title?: string;
  type?: string;
  error?: boolean;
  width?: string;
  helperText?: string;
  description?: string;
  multiline?: boolean;
  autoSelect?: boolean;
  options?: { label: string; value: string }[];
  autoComplete?: string;
  margin?: 'dense' | 'normal' | 'none';
  align?: 'left' | 'right' | 'center';
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
}

const FormInputMetaV2: React.FC<FormInputMetaProps> = ({
  fullWidth,
  label,
  title,
  error,
  helperText,
  form,
  inputMode,
  description,
  multiline,
  options,
  autoSelect,
  margin = 'normal',
  type = 'text',
  align = 'left',
  width,
  autoComplete
}) => {
  switch (type) {
    case 'checkbox':
      return (
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
          control={
            <Checkbox
              checked={Boolean(form.value)}
              onChange={form.onChange}
              onBlur={form.onBlur}
              name={form.name}
            />
          }
        />
      );

    case 'select':
      return (
        <FormControl fullWidth={fullWidth} error={!!error} variant='standard' margin={margin} size='medium'>
          <InputLabel>{title || label}</InputLabel>
          <Select
            {...form}
            label={title || label}
            value={form.value || ''}
          >
            {options?.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{helperText || description}</FormHelperText>
        </FormControl>
      );

    case 'choice':
      return (
        <FormControl fullWidth={fullWidth} error={!!error} variant='standard' margin={margin} size='medium'>
          <Typography variant='caption' color='textDisabled'>{title || label}</Typography>
          <Box display="flex" justifyContent='space-evenly'>
            {options?.map(option => (
              <MenuItem
                key={option.value}
                sx={{ width: '100%' }}
                onClick={() => form.onChange({ target: { value: option.value } })}
                selected={option.value === form.value}>
                {option.label}
              </MenuItem>
            ))}
          </Box>
          <FormHelperText>{helperText || description}</FormHelperText>
        </FormControl>
      );

    default:
      return (
        <FormControl fullWidth={fullWidth} error={!!error} variant='standard' margin={margin} sx={{ width }}>
          {type === 'date'
            ? <InputLabel shrink>{title || label}</InputLabel>
            : <InputLabel>{title || label}</InputLabel>
          }
          <Input
            {...form}
            autoComplete={autoComplete}
            onFocus={(e) => autoSelect && e.target.select()}
            sx={{ mr: width ? 1 : 0 }}
            type={type || 'text'}
            multiline={multiline}
            endAdornment={type === 'password' && <InputVisibilityAdornment />}
            slotProps={{
              input: {
                inputMode: inputMode,
              }
            }}
          />
          <FormHelperText sx={{ textWrap: 'nowrap' }}>
            {helperText || description}
          </FormHelperText>
        </FormControl>
      );
  }
};

export default FormInputMetaV2;