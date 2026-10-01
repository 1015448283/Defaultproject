import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 px-6 py-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <span className="text-primary-500 text-lg font-bold">Oliver Prada</span>
          <p className="text-gray-400 text-sm mt-1">Servicios Técnicos - Frontend Development & Bases de Datos</p>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link to="/servicios" className="hover:text-white transition-colors">Servicios</Link>
          <Link to="/portafolio" className="hover:text-white transition-colors">Portafolio</Link>
          <Link to="/testimonios" className="hover:text-white transition-colors">Testimonios</Link>
          <Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link>
        </div>
        <div className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Oliver Prada. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
