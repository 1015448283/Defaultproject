import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../../services/portfolioService';
import { Card, Badge, Button, Skeleton } from '../../components/common';
import { toast } from 'sonner';

export default function ContentAdmin() {
  const queryClient = useQueryClient();
  const { data: content, isLoading } = useQuery({
    queryKey: ['contenido-admin'],
    queryFn: async () => {
      const res = await contentService.getContenido();
      return res?.data ?? [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await contentService.deleteContenido(id);
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contenido-admin'] });
      queryClient.invalidateQueries({ queryKey: ['contenido'] });
      toast.success('Contenido eliminado correctamente');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al eliminar el contenido');
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Gestión de Contenido y Blog</h1>
        <p className="text-gray-400 text-sm">Artículos, guías y tutoriales técnicos</p>
      </div>

      {isLoading ? (
        <Skeleton height="h-20" lines={3} />
      ) : content && content.length > 0 ? (
        <div className="space-y-4">
          {content.map((c: any) => (
            <Card key={c.id} className="flex justify-between items-center gap-4 bg-dark-800 border-dark-700">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="text-white font-bold text-lg">{c.titulo}</p>
                  <Badge variant="info">{c.tipo}</Badge>
                </div>
                <p className="text-gray-400 text-sm">Slug: /{c.slug}</p>
                {c.fecha_publi && (
                  <p className="text-xs text-gray-500">
                    Fecha: {new Date(c.fecha_publi).toLocaleDateString('es-CO')}
                  </p>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <a
                  href={`/contenido/${c.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-400 hover:underline px-3 py-1"
                >
                  Ver artículo ↗
                </a>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleteMutation.isPending && deleteMutation.variables === c.id}
                  onClick={() => {
                    if (confirm(`¿Eliminar "${c.titulo}"?`)) {
                      deleteMutation.mutate(c.id);
                    }
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 text-gray-400">
          No hay artículos de blog o guías registradas.
        </Card>
      )}
    </div>
  );
}
