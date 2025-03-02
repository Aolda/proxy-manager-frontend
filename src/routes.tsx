import { Routes, Route } from 'react-router';
import Root from '@/pages/Root';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import RoutingList from '@/pages/routing/List';
import RoutingCreate from '@/pages/routing/Create';
import CertificateList from './pages/certificate/List';
import ForwardingList from '@/pages/forwarding/List';
import ForwardingCreate from './pages/forwarding/Create';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="routing">
          <Route index element={<RoutingList />} />
          <Route path="create" element={<RoutingCreate />} />
        </Route>
        <Route path="certificate">
          <Route index element={<CertificateList />} />
        </Route>
        <Route path="forwarding">
          <Route index element={<ForwardingList />} />
          <Route path="create" element={<ForwardingCreate />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
