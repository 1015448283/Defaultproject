import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { contentService } from '../../services/portfolioService';

export default function ContentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: content, loading } = useQuery({ queryKey: ['contenido', slug], queryFn: () => contentService.getContenidoBySlug(slug || '').then(r => r.data), enabled: !!slug });
  if (loading) return <div className="p-8"><div className="h-64 bg-dark-700 rounded-lg animate-pulse" /></div>;
  if (!content) return <div className="p-8 text-white">Contenido no encontrado</div>;
  return (
    <div className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{content.titulo}</h1>
        <p className="text-gray-500 mb-8">{new Date(content.fecha_publi).toLocaleDateString('es-ES')}</p>
        <div className="bg-dark-800 rounded-xl p-6 text-gray-300">
          {content.contenido}
        </div>
      </div>
    </div>
  );
}
