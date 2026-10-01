import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
