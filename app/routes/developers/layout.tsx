import { Outlet } from '@remix-run/react';

export default function Layout() {
  return (
    <>
      <div className="border p-6">
        <Outlet />
      </div>
    </>
  );
}
