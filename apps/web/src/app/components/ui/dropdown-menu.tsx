'use client';

import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { cn } from '@/app/utils/cn';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

type ContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>;

/** Painel do menu: `surface-raised`, `shape-card` e `elevation-2`, no portal do Radix. */
export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: ContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 rounded-card bg-surface-raised py-2 shadow-2 outline-none',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

type ItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item>;

/** Item de 32 px, destacado com `sidebar-active` ao receber o foco ou o mouse. */
export function DropdownMenuItem({ className, ...props }: ItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'flex min-h-8 cursor-default items-center gap-2 px-4 text-body text-fg outline-none',
        'data-[highlighted]:bg-sidebar-active data-[highlighted]:text-sidebar-on-active',
        className,
      )}
      {...props}
    />
  );
}

type SeparatorProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Separator
>;

export function DropdownMenuSeparator({ className, ...props }: SeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('my-2 h-px bg-border-subtle', className)}
      {...props}
    />
  );
}
