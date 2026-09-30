import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { user, signOut } = useAuthStore();
  return (
    <nav className="bg-dark-800 border-b border-dark-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-primary-500 text-xl font-bold">OP Services</Link>
        <div className="flex gap-4 items-center">
          <Link to="/servicios" className="text-gray-300 hover:text-white">Servicios</Link>
          <Link to="/portafolio" className="text-gray-300 hover:text-white">Portafolio</Link>
          <Link to="/testimonios" className="text-gray-300 hover:text-white">Testimonios</Link>
          <Link to="/contacto" className="text-gray-300 hover:text-white">Contacto</Link>
          {user ? (
            <button onClick={() => signOut()} className="bg-red-600 px-4 py-2 rounded">Cerrar Sesión</button>
          ) : (
            <Link to="/login" className="bg-primary-600 px-4 py-2 rounded">Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 px-6 py-6">
      <div className="max-w-7xl mx-auto text-center text-gray-500">
        <p>© 2026 Oliver Prada - Servicios Técnicos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
