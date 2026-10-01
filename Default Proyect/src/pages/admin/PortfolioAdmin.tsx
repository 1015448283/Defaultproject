import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioService } from '../../services/portfolioService';
import { Card, Badge, Button, Skeleton } from '../../components/common';
import { toast } from 'sonner';

export default function PortfolioAdmin() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ['portafolio-admin'],
    queryFn: async () => {
      const res = await portfolioService.getPortafolio();
      return res?.data ?? [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await portfolioService.deletePortafolio(id);
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portafolio-admin'] });
      queryClient.invalidateQueries({ queryKey: ['portafolio'] });
      toast.success('Proyecto eliminado del portafolio');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al eliminar el proyecto');
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Gestión de Portafolio</h1>
        <p className="text-gray-400 text-sm">Administra los proyectos destacados que se muestran en el sitio</p>
      </div>

      {isLoading ? (
        <Skeleton height="h-24" lines={3} />
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <Card key={item.id} className="flex flex-col justify-between bg-dark-800 border-dark-700 p-6">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{item.titulo}</h3>
                  <Badge variant={item.destacado ? 'success' : 'info'}>
                    {item.tipo}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.descripcion}</p>
                {item.tecnologias && (
                  <p className="text-xs text-primary-400 mb-4">{item.tecnologias}</p>
                )}
              </div>
              <div className="border-t border-dark-700 pt-4 flex justify-between items-center">
                {item.enlace ? (
                  <a href={item.enlace} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-400 hover:underline">
                    Ver link ↗
                  </a>
                ) : <span />}
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleteMutation.isPending && deleteMutation.variables === item.id}
                  onClick={() => {
                    if (confirm(`¿Eliminar "${item.titulo}" del portafolio?`)) {
                      deleteMutation.mutate(item.id);
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
          No hay elementos en el portafolio.
        </Card>
      )}
    </div>
  );
}
