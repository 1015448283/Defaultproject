import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-dark-700 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-dark-800 border-r border-dark-700 min-h-screen p-4 flex flex-col">
      <div className="mb-6 px-3">
        <h2 className="text-primary-500 font-bold text-lg tracking-tight">Panel Admin</h2>
        <p className="text-xs text-gray-500">Gestión de OP Services</p>
      </div>
      <nav className="flex flex-col gap-1.5 flex-1">
        <NavLink to="/admin" end className={linkClass}>📊 Dashboard</NavLink>
        <NavLink to="/admin/contactos" className={linkClass}>✉️ Contactos</NavLink>
        <NavLink to="/admin/proyectos" className={linkClass}>📁 Proyectos</NavLink>
        <NavLink to="/admin/pagos" className={linkClass}>💳 Pagos</NavLink>
        <NavLink to="/admin/agendamientos" className={linkClass}>📅 Agendamientos</NavLink>
        <NavLink to="/admin/servicios" className={linkClass}>⚙️ Servicios</NavLink>
        <NavLink to="/admin/portafolio" className={linkClass}>🎨 Portafolio</NavLink>
        <NavLink to="/admin/contenido" className={linkClass}>📝 Contenido</NavLink>
      </nav>
      <div className="pt-4 border-t border-dark-700 px-3">
        <NavLink to="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-2">
          ← Ver sitio web
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
