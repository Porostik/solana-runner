import { ComponentProps } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const variants = cva('relative', {
  variants: {
    variant: {
      default:
        'rounded-xl bg-background border border-secondary text-secondary-foreground text-xs',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof variants> & {
    loading?: boolean;
  };

export const Button = ({
  className,
  variant,
  children,
  loading,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(variants({ variant, className }), {
        'pointer-events-none': loading,
      })}
      {...props}
    >
      {loading && (
        <span className="text-sm absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 animate-pulse text-secondary">
          Loading...
        </span>
      )}
      <span className={cn({ 'opacity-0': loading })}>{children}</span>
    </button>
  );
};
