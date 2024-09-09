import { Link, useMatches, useParams, useSearchParams } from '@remix-run/react';
import { ComponentProps } from 'react';
import invariant from 'tiny-invariant';
import { getAltLanguage, isLanguage } from '~/modules/i18n';

/**
 * Props for the LanguageSwitcher component. Omits the `to` and `reloadDocument`
 * props from the `Link` component since those values are derived from the
 * current route.
 */
type LanguageSwitcherProps = Omit<
  ComponentProps<typeof Link>,
  'to' | 'reloadDocument'
>;

/**
 * Component that can be used to switch from one language to another.
 * (ie: 'en' → 'fr'; 'fr' → 'en')
 */
export function LanguageSwitcher({
  children,
  ...props
}: LanguageSwitcherProps) {
  const matches = useMatches();
  const [searchParams] = useSearchParams();

  const { lang } = useParams();
  invariant(isLanguage(lang));

  const altLanguage = getAltLanguage(lang);
  const currentRoute = matches[matches.length - 1];

  const pathname = currentRoute.pathname.replace(lang, altLanguage);
  const search = searchParams.toString();

  return (
    <Link reloadDocument to={{ pathname, search }} {...props}>
      {children}
    </Link>
  );
}
