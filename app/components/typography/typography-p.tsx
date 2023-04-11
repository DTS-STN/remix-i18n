import * as React from 'react';

export type TypographyPProps = React.PropsWithChildren;

export const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  TypographyPProps
>(({ children, ...props }, ref) => {
  return (
    <p className="mt-6" ref={ref} {...props}>
      {children}
    </p>
  );
});

TypographyP.displayName = 'TypographyP';
