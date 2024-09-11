import * as React from 'react';

export interface TypographyPProps extends React.PropsWithChildren {}

export const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  TypographyPProps
>(({ children }, ref) => {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
});

TypographyP.displayName = 'TypographyP';
