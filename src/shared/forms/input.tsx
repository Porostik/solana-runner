import { ComponentProps } from 'react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Input } from '../ui/input';

export type FormInputProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<ComponentProps<typeof Input>, 'value' | 'defaultValue' | 'ref'>;

export const FormInput = <T extends FieldValues>({
  control,
  name,
  ...props
}: FormInputProps<T>) => {
  const controller = useController({ control, name });

  return (
    <Input
      error={controller.fieldState.error?.message}
      {...props}
      {...controller.field}
    />
  );
};
