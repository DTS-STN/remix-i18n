import { useLoaderData, useParams } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { AppLink } from '~/components/app-link';
import { TypographyH1 } from '~/components/typography-h1';
import { Button } from '~/components/ui/button';
import { actors } from './data.server';

export function loader() {
  return { actors };
}

export default function Actor() {
  const loaderData = useLoaderData<typeof loader>();
  const { id } = useParams();

  type ActorId = keyof typeof loaderData.actors;
  const actor = loaderData.actors[id as ActorId];
  invariant(actor, 'Expected actor to be defined');

  return (
    <>
      <TypographyH1>{actor}!</TypographyH1>
      <div className="mt-4">
        <AppLink routeId="/actors">
          <Button size="lg" variant="destructive">
            ← Back
          </Button>
        </AppLink>
      </div>
    </>
  );
}
