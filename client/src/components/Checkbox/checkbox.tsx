import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer relative h-4 w-4 shrink-0 rounded-sm border border-light-gray shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:before:content-['✔'] data-[state=checked]:before:text-white data-[state=checked]:before:text-[10px] data-[state=checked]:before:absolute data-[state=checked]:before:top-1/2 data-[state=checked]:before:left-1/2 data-[state=checked]:before:-translate-x-1/2 data-[state=checked]:before:-translate-y-1/2 data-[state=checked]:before:leading-none",

      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator></CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
