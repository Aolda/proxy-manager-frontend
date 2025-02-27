import { Routes, Route } from 'react-router';
import Root from '@/pages/Root';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />}></Route>
    </Routes>
  );
}
