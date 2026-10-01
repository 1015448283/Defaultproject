import { useQuery } from '@tanstack/react-query';
import { portfolioService } from '../../services/portfolioService';
import { Card } from '../common';
import { Link } from 'react-router-dom';

export function Portfolio() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['portafolio-home'],
    queryFn: async () => {
      const res = await portfolioService.getPortafolio();
      if (res.error) throw res.error;
      return res.data;
    }
  });

  return (
    <section className="py-16 px-6 bg-dark-900/50 border-y border-dark-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Portafolio Destacado</h2>
            <p className="text-gray-400">Proyectos recientes desarrollados con tecnologías modernas.</p>
          </div>
          <Link to="/portafolio" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            Ver todos →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-dark-800 rounded-xl border border-dark-700 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items?.slice(0, 3).map((item: any) => (
              <Card key={item.id} className="overflow-hidden p-0 border border-dark-700 bg-dark-800 flex flex-col">
                {item.imagen_url && (
                  <img src={item.imagen_url} alt={item.titulo} className="w-full h-48 object-cover" />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.titulo}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">{item.descripcion}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tecnologias?.split(',').map((t: string, i: number) => (
                      <span key={i} className="bg-primary-950 text-primary-400 px-2 py-0.5 rounded text-xs border border-primary-900">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                  {item.enlace && (
                    <a href={item.enlace} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline text-sm font-medium">
                      Ver proyecto
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
