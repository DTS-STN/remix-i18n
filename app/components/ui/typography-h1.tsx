import * as React from 'react';

export interface TypographyH1Props extends React.PropsWithChildren {}

export const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  TypographyH1Props
>(({ children }, ref) => {
  return (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
      ref={ref}
    >
      {children}
    </h1>
  );
});

TypographyH1.displayName = 'TypographyH1';
