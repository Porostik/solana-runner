import { ComponentProps } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const variants = cva('', {
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

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof variants>;

export const Button = ({ className, variant, ...props }: ButtonProps) => {
  return <button className={variants({ variant, className })} {...props} />;
};
