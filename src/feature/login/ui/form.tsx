import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { FormInput } from '@/shared/forms';
import { Button } from '@/shared/ui/button';

const schema = z.object({
  name: z
    .string({ message: 'Имя должно содержать хотя бы 5 символов' })
    .min(5, 'Имя должно содержать хотя бы 5 символов')
    .max(30, 'Имя может содержать максимум 30 символов'),
});

type FormValues = z.infer<typeof schema>;

interface LoginFormProps {
  onSubmit: (params: { name: string }) => void;
  loading: boolean;
}

export const LoginForm = ({ onSubmit, loading }: LoginFormProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      className="flex flex-col gap-3 px-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        name="name"
        label="Enter your name:"
        placeholder="..."
        autoFocus
        control={control}
      />
      <Button className="py-3" loading={loading}>
        Ready
      </Button>
    </form>
  );
};
