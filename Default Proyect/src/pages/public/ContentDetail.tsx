import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { contentService } from '../../services/portfolioService';

export default function ContentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: content, isLoading } = useQuery({
    queryKey: ['contenido', slug],
    queryFn: async () => {
      const res = await contentService.getContenidoBySlug(slug || '');
      return res?.data ?? null;
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="py-16 px-6 max-w-3xl mx-auto">
        <div className="h-10 bg-dark-800 rounded-lg animate-pulse mb-4 w-3/4" />
        <div className="h-4 bg-dark-800 rounded animate-pulse mb-8 w-1/4" />
        <div className="h-64 bg-dark-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="py-24 px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Artículo o Contenido no encontrado</h2>
        <p className="text-gray-400 mb-6">El artículo solicitado no existe o fue despublicado.</p>
        <Link to="/" className="text-primary-400 hover:underline">← Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="py-16 px-6">
      <article className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
          ← Volver al inicio
        </Link>
        <span className="block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-2">
          {content.tipo}
        </span>
        <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">{content.titulo}</h1>
        {content.fecha_publi && (
          <p className="text-gray-500 text-sm mb-8">
            Publicado el {new Date(content.fecha_publi).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-gray-300 leading-relaxed whitespace-pre-line text-lg">
          {content.contenido}
        </div>
      </article>
    </div>
  );
}
