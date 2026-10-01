import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-black text-primary-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Página no encontrada</h2>
        <p className="text-gray-400 mb-8">
          La ruta a la que intentas acceder no existe o fue movida temporalmente.
        </p>
        <Link
          to="/"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
