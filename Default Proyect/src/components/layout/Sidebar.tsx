export function Sidebar() {
  return (
    <aside className="w-64 bg-dark-800 border-r border-dark-700 min-h-screen p-4">
      <h2 className="text-primary-500 font-bold text-lg mb-6">Panel Admin</h2>
      <nav className="flex flex-col gap-2">
        <a href="/admin" className="text-gray-300 hover:text-white py-2">Dashboard</a>
        <a href="/admin/contactos" className="text-gray-300 hover:text-white py-2">Contactos</a>
        <a href="/admin/proyectos" className="text-gray-300 hover:text-white py-2">Proyectos</a>
        <a href="/admin/pagos" className="text-gray-300 hover:text-white py-2">Pagos</a>
        <a href="/admin/agendamientos" className="text-gray-300 hover:text-white py-2">Agendamientos</a>
        <a href="/admin/servicios" className="text-gray-300 hover:text-white py-2">Servicios</a>
        <a href="/admin/portafolio" className="text-gray-300 hover:text-white py-2">Portafolio</a>
        <a href="/admin/contenido" className="text-gray-300 hover:text-white py-2">Contenido</a>
      </nav>
    </aside>
  );
}
