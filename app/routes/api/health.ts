import { json } from '@remix-run/react';

export function loader() {
  return json({ status: 'UP' });
}
