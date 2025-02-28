import { Routes, Route } from 'react-router';
import Root from '@/pages/Root';
import Home from '@/pages/Home';
import Login from '@/pages/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}
