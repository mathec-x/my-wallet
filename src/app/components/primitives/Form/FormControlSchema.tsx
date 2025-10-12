import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography } from '@mui/material';
import { forwardRef, useId, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { ZodObject } from 'zod';
import FormSingleInput from './FormSingleInput';

export interface FormControlRef<T> {
  reset: (values?: T) => void;
  setValue: <P extends keyof T >(name: P, value: T[P]) => void;
}

interface FormControlSchemaProps {
  children?: React.ReactNode;
  schema: ZodObject;
  errorMessage?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: any) => void;
}
const FormControlSchema = forwardRef(
  ({ schema, onSubmit, children, errorMessage }: FormControlSchemaProps, ref) => {

    const id = useId();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
      resolver: zodResolver(schema)
    });

    useImperativeHandle(ref, () => ({
      reset: reset,
      setValue: setValue
    }));

    return (
      <Box
        component="form"
        onSubmit={onSubmit && handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 2 }}
      >
        {schema.shape && Object.keys(schema.shape).map((key) => {
          const meta = schema.shape[key].meta();
          return (
            <FormSingleInput
              key={`${id}-${key}`}
              fullWidth
              label={meta?.title || key}
              type={meta?.type || 'text'}
              error={!!errors[key]}
              helperText={errors?.[key]?.message || meta?.description || ''}
              form={register(key)}
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