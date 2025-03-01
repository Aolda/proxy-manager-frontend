import { Routes, Route } from 'react-router';
import Root from '@/pages/Root';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import RoutingList from '@/pages/routing/List';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="routing">
          <Route index element={<RoutingList />} />
        </Route>
      </Route>
    </Routes>
  );
}
