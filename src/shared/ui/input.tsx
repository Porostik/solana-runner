import { ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  label?: string;
  error?: string;
}

export const Input = ({ className, label, error, ...props }: InputProps) => {
  return (
    <label className="flex flex-col items-start gap-2 w-full">
      {label && <span className="text-sm text-secondary">{label}</span>}
      <input
        className="w-full bg-background border border-secondary rounded-lg outline-none py-2 px-3 text-secondary-foreground text-sm placeholder:text-secondary-foreground"
        {...props}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
};
