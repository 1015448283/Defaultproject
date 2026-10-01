import { useQuery } from '@tanstack/react-query';
import { testimonialService } from '../../services/portfolioService';
import { Card } from '../common';
import { Link } from 'react-router-dom';

export function Testimonials() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonios-home'],
    queryFn: async () => {
      const res = await testimonialService.getTestimonios();
      if (res.error) throw res.error;
      return res.data;
    }
  });

  return (
    <section className="py-16 px-6 bg-dark-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Testimonios</h2>
            <p className="text-gray-400">La experiencia de quienes ya han trabajado conmigo.</p>
          </div>
          <Link to="/testimonios" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            Ver todos →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-dark-800 rounded-xl border border-dark-700 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials?.slice(0, 3).map((t: any) => (
              <Card key={t.id} className="border border-dark-700 bg-dark-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {Array.from({ length: t.calificacion || 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 italic text-sm mb-4">"{t.contenido}"</p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.nombre}</p>
                  <p className="text-gray-500 text-xs">{t.rol}, {t.empresa}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
