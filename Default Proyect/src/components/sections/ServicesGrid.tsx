import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../../services/projectService';
import { Card } from '../common';
import { Link } from 'react-router-dom';

export function ServicesGrid() {
  const { data: services, isLoading } = useQuery({
    queryKey: ['servicios-home'],
    queryFn: async () => {
      const res = await serviceService.getServicios();
      if (res.error) throw res.error;
      return res.data;
    }
  });

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Servicios Especializados</h2>
            <p className="text-gray-400">Soluciones técnicas a medida para tu empresa o proyecto personal.</p>
          </div>
          <Link to="/servicios" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            Ver catálogo completo →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-56 bg-dark-800 rounded-xl border border-dark-700 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((s: any) => (
              <Card key={s.id} className="flex flex-col justify-between border border-dark-700 bg-dark-800 hover:border-primary-500/50 transition-all p-6">
                <div>
                  <h3 className="text-xl font-bold text-primary-400 mb-2">{s.nombre}</h3>
                  <p className="text-gray-400 text-sm mb-4">{s.descripcion}</p>
                </div>
                <div className="border-t border-dark-700 pt-4 mt-2 flex items-center justify-between">
                  {s.precio_base ? (
                    <p className="text-white font-bold">${Number(s.precio_base).toLocaleString()} COP</p>
                  ) : <span />}
                  <Link to="/contacto" className="text-primary-500 hover:text-primary-400 text-sm font-semibold">
                    Contratar →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
