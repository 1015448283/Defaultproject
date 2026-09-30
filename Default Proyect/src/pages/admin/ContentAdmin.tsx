import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../../services/portfolioService';
import { Card } from '../../components/common/Card';
import { toast } from 'sonner';

export default function ContentAdmin() {
  const queryClient = useQueryClient();
  const { data: content, loading } = useQuery({ queryKey: ['contenido'], queryFn: () => contentService.getContenido().then(r => r.data) });
  const deleteMutation = useMutation({ mutationFn: contentService.deleteContenido, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contenido'] }), onError: () => toast.error('Error al eliminar') });
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Gestión de Contenido</h1>
      {loading ? <div className="animate-pulse">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-dark-700 rounded mb-2" />)}</div> : (
        <div className="space-y-2">
          {content?.map((c: any) => (
            <Card key={c.id} className="flex justify-between items-center">
              <div>
                <p className="text-white font-bold">{c.titulo}</p>
                <p className="text-gray-500 text-sm">{c.tipo} - {c.slug}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => deleteMutation.mutate(c.id)} className="bg-red-600 px-3 py-1 rounded text-sm">Eliminar</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
