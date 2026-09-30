import { useQuery } from '@tanstack/react-query';
import { testimonialService } from '../../services/portfolioService';
import { Card } from '../common/Card';

export function Testimonials() {
  const { data: testimonials, loading } = useQuery({ queryKey: ['testimonios'], queryFn: () => testimonialService.getTestimonios().then(r => r.data) });
  if (loading) return <div className="py-16 px-6"><div className="h-32 bg-dark-700 rounded-lg animate-pulse mb-4" /></div>;
  return (
    <section className="py-16 px-6 bg-dark-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Testimonios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((t: any) => (
            <Card key={t.id}>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: t.calificacion || 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 italic mb-4">{t.contenido}</p>
              <div>
                <p className="text-white font-bold">{t.nombre}</p>
                <p className="text-gray-500 text-sm">{t.rol}, {t.empresa}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
