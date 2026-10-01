import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../../services/projectService';
import { Card, Button } from '../../components/common';
import { Link } from 'react-router-dom';

export default function Services() {
  const { data: services, isLoading } = useQuery({
    queryKey: ['servicios'],
    queryFn: async () => {
      const res = await serviceService.getServicios();
      if (res.error) throw res.error;
      return res.data;
    }
  });

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Servicios Profesionales</h1>
          <p className="text-gray-400">
            Desarrollo web moderno con React y Vite, bases de datos PostgreSQL robustas y arquitectura escalable.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-dark-800 border border-dark-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((s: any) => (
              <Card key={s.id} className="flex flex-col justify-between border border-dark-700 bg-dark-800 p-6">
                <div>
                  <h3 className="text-2xl font-bold text-primary-400 mb-3">{s.nombre}</h3>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">{s.descripcion}</p>
                </div>
                <div className="border-t border-dark-700 pt-4">
                  <div className="flex justify-between items-baseline mb-4">
                    {s.precio_base && (
                      <span className="text-2xl font-bold text-white">
                        ${Number(s.precio_base).toLocaleString()} <span className="text-xs text-gray-400 font-normal">COP</span>
                      </span>
                    )}
                    {s.duracion_estimada && (
                      <span className="text-xs text-gray-500">~{s.duracion_estimada} días</span>
                    )}
                  </div>
                  <Link to="/contacto" className="block w-full">
                    <Button variant="primary" className="w-full">
                      Solicitar este Servicio
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
