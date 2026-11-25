import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// A escala de texto do design system (`text-body`, `text-small`...) não é a do Tailwind.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'heading',
            'title',
            'body',
            'small',
            'caption',
            'micro',
          ],
        },
      ],
    },
  },
});

/** Junta classes condicionais e resolve conflitos do Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
