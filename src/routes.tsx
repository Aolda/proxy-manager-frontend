import { Routes, Route } from 'react-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import Root from '@/pages/Root';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import RoutingList from '@/pages/routing/List';
import RoutingCreate from '@/pages/routing/Create';
import RoutingEdit from '@/pages/routing/Edit';
import CertificateList from './pages/certificate/List';
import CertificateCreate from './pages/certificate/Create';
import ForwardingList from '@/pages/forwarding/List';
import ForwardingCreate from './pages/forwarding/Create';
import ForwardingEdit from './pages/forwarding/Edit';
import LogList from './pages/log/List';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="routing">
            <Route index element={<RoutingList />} />
            <Route path="create" element={<RoutingCreate />} />
            <Route path="edit/:id" element={<RoutingEdit />} />
          </Route>
          <Route path="certificate">
            <Route index element={<CertificateList />} />
            <Route path="create" element={<CertificateCreate />} />
          </Route>
          <Route path="forwarding">
            <Route index element={<ForwardingList />} />
            <Route path="create" element={<ForwardingCreate />} />
            <Route path="edit/:id" element={<ForwardingEdit />} />
          </Route>
          <Route path="log">
            <Route index element={<LogList />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
