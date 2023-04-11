import * as React from 'react';

import {
  generatePath,
  Link,
  useParams,
  useSearchParams,
} from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

import { useCurrentLanguage } from '~/hooks/use-current-language';
import { useCurrentRouteId } from '~/hooks/use-current-route-id';
import { useI18nPath } from '~/hooks/use-i18n-path';
import { getAltLanguage } from '~/modules/i18n';
import { cn } from '~/modules/utils';
import { isPageRouteId } from '~/routes';

/**
 * The Remix <Link> props.
 */
type LinkProps = React.ComponentProps<typeof Link>;

/**
 * Props for the LanguageSwitcher component, omitting `to` and `reloadDocument`
 * from the `Link` component since those are derived from the current route.
 */
export type LanguageSwitcherProps = Omit<LinkProps, 'to' | 'reloadDocument'>;

/**
 * A component that allows switching between languages (e.g., 'en' ↔ 'fr').
 */
export const LanguageSwitcher = React.forwardRef<
  HTMLAnchorElement,
  LanguageSwitcherProps
>(({ children, className, ...props }, ref) => {
  const { t } = useTranslation(['common']);

  const currentLanguage = useCurrentLanguage();
  const routeId = useCurrentRouteId();
  const [searchParams] = useSearchParams();
  const params = useParams();

  invariant(currentLanguage, 'Expected currentLanguage to be defined');
  invariant(
    isPageRouteId(routeId),
    'Expected currentRouteId to be a page route id',
  );

  const altLanguage = getAltLanguage(currentLanguage);
  const pathname = generatePath(useI18nPath(routeId, altLanguage), params);
  const search = searchParams.toString();

  return (
    <Link
      aria-label={t('common:switch-language')}
      aria-current={false}
      ref={ref}
      to={{ pathname, search }}
      lang={altLanguage}
      reloadDocument={true}
      className={cn(
        'font-medium text-blue-600 hover:underline dark:text-blue-500',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';
