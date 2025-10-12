import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField } from '@mui/material';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { ZodObject } from 'zod';

interface FormControlSchemaProps {
  children?: React.ReactNode;
  schema: ZodObject;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: any) => void;
}
const FormControlSchema: React.FC<FormControlSchemaProps> = ({ schema, onSubmit, children }) => {
  const id = useId();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

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
          <TextField
            key={`${id}-${key}`}
            variant="standard"
            margin="normal"
            size='medium'
            label={meta?.title || key}
            type={meta?.type || 'text'}
            fullWidth
            error={!!errors[key]}
            helperText={errors?.[key]?.message || meta?.description || ''}
            sx={{
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
            {...register(key)}
          />
        );
      })}
      {children}
    </Box>
  );
};

export default FormControlSchema;