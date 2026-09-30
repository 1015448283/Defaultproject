import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioService } from '../../services/portfolioService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Card';
import { toast } from 'sonner';

export default function PortfolioAdmin() {
  const queryClient = useQueryClient();
  const { data: items, loading } = useQuery({ queryKey: ['portafolio'], queryFn: () => portfolioService.getPortafolio().then(r => r.data) });
  const deleteMutation = useMutation({ mutationFn: portfolioService.deletePortafolio, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portafolio'] }), onError: () => toast.error('Error al eliminar') });
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Gestión de Portafolio</h1>
      {loading ? <div className="animate-pulse">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 bg-dark-700 rounded mb-4" />)}</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items?.map((item: any) => (
            <Card key={item.id}>
              <h3 className="text-lg font-bold text-white mb-2">{item.titulo}</h3>
              <p className="text-gray-400 text-sm mb-4">{item.descripcion?.slice(0, 100)}...</p>
              <div className="flex gap-2">
                <button onClick={() => deleteMutation.mutate(item.id)} className="bg-red-600 px-3 py-1 rounded text-sm">Eliminar</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
