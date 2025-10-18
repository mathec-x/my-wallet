'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography } from '@mui/material';
import { forwardRef, useId, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { ZodObject } from 'zod';
import FormInputMeta from './FormInputMeta';

export interface FormControlRef<T> {
  reset: (values?: T) => void;
  setValue: <P extends keyof T >(name: P, value: T[P]) => void;
}

interface FormControlSchemaProps {
  children?: React.ReactNode;
  schema: ZodObject;
  errorMessage?: string | null;
  id?: string;
  value?: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: any) => void;
}
const FormControlSchema = forwardRef(
  ({ schema, onSubmit, children, errorMessage, id: propId, value }: FormControlSchemaProps, ref) => {
    const id = useId();
    const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm({
      resolver: zodResolver(schema),
      defaultValues: value
    });

    useImperativeHandle(ref, () => ({
      reset: reset,
      setValue: setValue
    }));

    return (
      <Box
        id={propId || id}
        component="form"
        onSubmit={onSubmit && handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 2 }}
      >
        {schema.shape && Object.keys(schema.shape).map((key) => {
          const meta = schema.shape[key].meta();
          return (
            <FormInputMeta
              key={`${id}-${key}`}
              fullWidth
              error={!!errors[key]}
              helperText={errors?.[key]?.message}
              form={register(key)}
              control={control}
              {...meta}
            />);
        })}
        {children}
        {errorMessage &&
          <Typography color='error' variant='body2' align='center' mt={2}>
            {errorMessage}
          </Typography>
        }
      </Box>
    );
  });

FormControlSchema.displayName = 'FormControlSchema';
export default FormControlSchema;