import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-xsm'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  const allClasses = clsx(inputs);

  const textClasses: string[] = [];
  const otherClasses: string[] = [];

  allClasses.split(' ').forEach((cls) => {
    if (cls.startsWith('text')) {
      textClasses.push(cls);
    } else {
      otherClasses.push(cls);
    }
  });

  return [twMerge(otherClasses.join(' ')), ...textClasses]
    .filter(Boolean)
    .join(' ');
}
