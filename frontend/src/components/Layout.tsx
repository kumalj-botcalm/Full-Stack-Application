import { Outlet } from 'react-router-dom';
import Navigation from '@/components/navbar/Navigation';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
}
