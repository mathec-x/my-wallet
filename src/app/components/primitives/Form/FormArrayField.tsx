'use client';

import { Sum } from '@/shared/utils/math';
import { floatToMoney, moneyToFloat } from '@/shared/utils/money-format';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { type ZodObject } from 'zod';
import { FlexBox } from '../../elements';
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

  const calculateTotal = () => {
    if (fields?.length > 0 && meta?.calculate && typeof meta.calculate === 'string') {
      const calc = Sum(fields as unknown as Record<string, number | undefined>[], (e) => moneyToFloat(e?.[meta.calculate as string] || 0) || 0);
      return 'R$ ' + floatToMoney(calc);
    }

    return null;
  };


  return (
    <Box>
      <FlexBox pr={1} bgcolor="transparent" justifyContent="space-between">
        {fields.length > 0 && (<>
          <div style={{ marginTop: 32 }}>
            {meta?.title && <Typography variant='body1' lineHeight={0.5}>{meta?.title}</Typography>}
            {meta?.description && <Typography variant='caption'>{meta?.description}</Typography>}
          </div>
          {meta?.calculate && <Typography>{calculateTotal()}</Typography>}
        </>)}
      </FlexBox>
      {fields.map((field, index) => (
        <Box key={field.id} display="flex" justifyContent="center" alignItems="end" gap={1}>
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
                    margin="dense"
                    inputType="base"
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