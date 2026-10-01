import { useQuery } from '@tanstack/react-query';
import { testimonialService } from '../../services/portfolioService';
import { Card } from '../../components/common';
import { Link } from 'react-router-dom';

export default function Testimonials() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonios'],
    queryFn: async () => {
      const res = await testimonialService.getTestimonios();
      if (res.error) throw res.error;
      return res.data;
    }
  });

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Lo Que Dicen Los Clientes</h1>
          <p className="text-gray-400">
            Opiniones reales de profesionales y emprendedores que han confiado en mis servicios de desarrollo.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 bg-dark-800 border border-dark-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials?.map((t: any) => (
              <Card key={t.id} className="flex flex-col justify-between border border-dark-700 bg-dark-800 p-6">
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < (t.calificacion || 5) ? 'text-amber-400' : 'text-gray-600'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6">"{t.contenido}"</p>
                </div>
                <div className="border-t border-dark-700 pt-4">
                  <p className="text-white font-bold">{t.nombre}</p>
                  <p className="text-gray-400 text-sm">{t.rol}{t.empresa ? ` en ${t.empresa}` : ''}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 text-center bg-gradient-to-r from-primary-900/30 to-dark-800 border border-primary-800/40 rounded-2xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">¿Listo para comenzar tu proyecto?</h2>
          <p className="text-gray-400 mb-6">Trabajemos juntos para llevar tu presencia web y base de datos al siguiente nivel.</p>
          <Link to="/contacto" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block">
            Solicitar Cotización
          </Link>
        </div>
      </div>
    </div>
  );
}
