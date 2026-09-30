import { useQuery } from '@tanstack/react-query';
import { portfolioService } from '../../services/portfolioService';
import { Card } from '../common/Card';
import { Link } from 'react-router-dom';

export function Portfolio() {
  const { data: items, loading } = useQuery({ queryKey: ['portafolio'], queryFn: () => portfolioService.getPortafolio().then(r => r.data) });
  if (loading) return <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-dark-700 rounded-lg animate-pulse" />)}</div>;
  return (
    <section className="py-16 px-6 bg-dark-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Portafolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((item: any) => (
            <Card key={item.id} className="overflow-hidden">
              {item.imagen_url && <img src={item.imagen_url} alt={item.titulo} className="w-full h-48 object-cover" />}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{item.titulo}</h3>
                <p className="text-gray-400 mb-2">{item.descripcion}</p>
                <div className="flex gap-2 mb-3">
                  {item.tecnologias?.split(',').map((t: string, i: number) => (
                    <span key={i} className="bg-primary-900 text-primary-400 px-2 py-1 rounded text-xs">{t.trim()}</span>
                  ))}
                </div>
                {item.enlace && <a href={item.enlace} className="text-primary-500 hover:underline text-sm">Ver proyecto</a>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
