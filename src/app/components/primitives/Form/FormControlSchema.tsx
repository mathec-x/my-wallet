'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { forwardRef, useId, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { ZodArray, ZodObject } from 'zod';
import FormArrayField from './FormArrayField';
import FormInputMeta from './FormInputMeta';

export interface FormControlRef<T> {
  reset: (values?: T) => void;
  setValue: <P extends keyof T >(name: P, value: T[P]) => void;
}

interface FormControlSchemaProps<S = ZodObject> {
  children?: React.ReactNode;
  schema: S;
  errorMessage?: string | null;
  id?: string;
  value?: Record<string, unknown>;
  margin?: 'dense' | 'normal' | 'none';
  component?: React.ElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: any) => void;
}
const FormControlSchema = forwardRef(
  ({ schema, onSubmit, children, errorMessage, id: propId, value, margin, component = 'form' }: FormControlSchemaProps, ref) => {
    const id = useId();
    const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm({
      resolver: zodResolver(schema),
      defaultValues: value,
      mode: 'all'
    });

    useImperativeHandle(ref, () => ({
      reset: reset,
      setValue: setValue
    }));

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit) {
        return handleSubmit(onSubmit)(e);
      }
    };

    return (
      <Box
        id={propId || id}
        component={component}
        onSubmit={handleSubmitForm}
        noValidate
        sx={{ mt: 2 }}>
        {schema.shape && Object.keys(schema.shape).map((key) => {
          const meta = schema.shape[key].meta();
          return schema.shape[key] instanceof ZodArray ? (
            // when schema is an array, we need to render a FormArrayField
            <FormArrayField
              key={`${id}-${key}`}
              name={key}
              control={control}
              schema={schema.shape[key].element instanceof ZodObject ? schema.shape[key].element : undefined}
            />
          ) : (
            <FormInputMeta
              key={`${id}-${key}`}
              fullWidth
              margin={margin}
              error={!!errors[key]}
              helperText={errors?.[key]?.message}
              form={register(key)}
              control={control}
              {...meta}
            />
          );
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