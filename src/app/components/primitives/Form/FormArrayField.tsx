'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { type ZodObject } from 'zod';
import FormInputMeta from './FormInputMeta';

interface FormArrayFieldProps<S extends ZodObject = ZodObject> {
  name: string;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  schema?: S; // Schema do OBJETO dentro do array
  children?: React.ReactNode;
}

const FormArrayField: React.FC<FormArrayFieldProps> = ({
  name,
  control,
  schema,
  children,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  if (!schema?.shape) return null;

  const meta = schema.meta();
  const keys = Object.keys(schema.shape);

  const handleAppend = () => {
    append(keys.reduce((acc, curr) => {
      acc[curr] = '';
      return acc;
    }, {} as Record<string, unknown>));
  };

  return (
    <Box>
      <Divider sx={{ my: 4 }} />
      {fields.length > 0 && meta?.title && <Typography variant='caption'>{meta?.title}</Typography>}
      {fields.map((field, index) => (
        <Box key={field.id} display="flex" justifyContent="center" alignItems="end" gap={4}>
          {/* Renderizar campos usando o control do parent */}
          {schema && schema.shape && Object.keys(schema.shape).map((key) => {
            const meta = schema.shape[key].meta?.();

            if (!meta)
              return null;

            return (
              <Controller
                key={`${name}.${index}.${key}`}
                name={`${name}.${index}.${key}`}
                control={control}
                render={({ field: fieldProps, fieldState: { error } }) => (
                  <FormInputMeta
                    fullWidth
                    margin="none"
                    error={!!error}
                    helperText={error?.message}
                    form={fieldProps as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                    control={control}
                    {...meta}
                  />
                )}
              />
            );
          })}
          <IconButton onClick={() => remove(index)} type="button">
            <DeleteIcon />
          </IconButton>
          {children}
        </Box>
      ))}
      <Button
        fullWidth
        size="small"
        variant="outlined"
        sx={{ mt: 4 }}
        onClick={handleAppend}
        startIcon={<AddIcon />}
      >
        {meta?.description}
      </Button>
    </Box>
  );
};

export default FormArrayField;