import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { portfolioService } from '../../services/portfolioService';
import { Card, Badge } from '../../components/common';

export default function Portfolio() {
  const [filter, setFilter] = useState<'all' | 'proyecto' | 'servicio' | 'caso_study'>('all');
  const { data: items, isLoading } = useQuery({
    queryKey: ['portafolio'],
    queryFn: async () => {
      const res = await portfolioService.getPortafolio();
      if (res.error) throw res.error;
      return res.data;
    }
  });

  const filteredItems = items?.filter(item => filter === 'all' || item.tipo === filter);

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Portafolio de Proyectos</h1>
          <p className="text-gray-400">
            Explora algunos de los trabajos desarrollados en diseño frontend y gestión de bases de datos relacionales.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {(['all', 'proyecto', 'servicio', 'caso_study'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
                }`}
              >
                {type === 'all' ? 'Todos' : type === 'proyecto' ? 'Proyectos' : type === 'servicio' ? 'Servicios' : 'Casos de Estudio'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 bg-dark-800 border border-dark-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems?.map((item: any) => (
              <Card key={item.id} className="overflow-hidden flex flex-col p-0 border border-dark-700 bg-dark-800">
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.titulo} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-dark-700 flex items-center justify-center text-gray-500">
                    Sin imagen
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{item.titulo}</h3>
                    <Badge variant={item.tipo === 'proyecto' ? 'info' : 'success'}>
                      {item.tipo}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 flex-1">{item.descripcion}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tecnologias?.split(',').map((tech: string, idx: number) => (
                      <span key={idx} className="bg-primary-950/60 text-primary-400 text-xs px-2 py-0.5 rounded border border-primary-800/40">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  {item.enlace && (
                    <a
                      href={item.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-400 font-medium text-sm inline-flex items-center gap-1 mt-auto"
                    >
                      Ver proyecto en vivo →
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
