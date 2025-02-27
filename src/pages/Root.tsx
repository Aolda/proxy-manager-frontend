import { Outlet } from 'react-router';

export default function Root() {
  return (
    <div>
      <h1>Proxy Manager</h1>
      <Outlet />
    </div>
  );
}
