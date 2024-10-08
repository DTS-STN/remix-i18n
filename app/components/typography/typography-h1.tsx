import * as React from 'react';

export type TypographyH1Props = React.PropsWithChildren;

export const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  TypographyH1Props
>(({ children, ...props }, ref) => {
  return (
    <h1
      className="text-4xl font-bold tracking-tight lg:text-5xl"
      ref={ref}
      {...props}
    >
      {children}
    </h1>
  );
});

TypographyH1.displayName = 'TypographyH1';
