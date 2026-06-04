import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useFormSchema = <T, J>(schema: T, initialData?: J) => {
  // @ts-expect-error
  const resolver = zodResolver(schema);
  const { formState, register, handleSubmit, ...form } = useForm({
    resolver,
    shouldFocusError: true,
    defaultValues: initialData || {},
  });

  return {
    errors: formState.errors,
    setValue: form.setValue,
    watchValue: form.watch,
    register,
    handleSubmit,
  };
};
