import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../../services/projectService';
import { Card } from '../common/Card';
import { Link } from 'react-router-dom';

export function ServicesGrid() {
  const { data: services, loading } = useQuery({ queryKey: ['servicios'], queryFn: () => serviceService.getServicios().then(r => r.data) });
  if (loading) return <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"><div className="h-48 bg-dark-700 rounded-lg animate-pulse" /><div className="h-48 bg-dark-700 rounded-lg animate-pulse" /></div>;
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((s: any) => (
            <Card key={s.id}>
              <h3 className="text-xl font-bold text-primary-500 mb-2">{s.nombre}</h3>
              <p className="text-gray-400 mb-4">{s.descripcion}</p>
              {s.precio_base && <p className="text-white font-bold">${s.precio_base.toLocaleString()} COP</p>}
              <Link to="/contacto" className="text-primary-500 hover:underline mt-4 inline-block">Contratar</Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
