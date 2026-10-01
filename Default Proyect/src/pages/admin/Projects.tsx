import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../services/projectService';
import { Card, Badge, Button, Skeleton } from '../../components/common';
import { toast } from 'sonner';

export default function Projects() {
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useQuery({
    queryKey: ['proyectos'],
    queryFn: async () => {
      const res = await projectService.getProyectos();
      return res?.data ?? [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await projectService.deleteProyecto(id);
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      toast.success('Proyecto eliminado correctamente');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al eliminar el proyecto');
    }
  });

  const statusVariant: Record<string, string> = {
    pendiente: 'pending',
    en_progreso: 'info',
    completado: 'success',
    cancelado: 'error',
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Proyectos</h1>
          <p className="text-gray-400 text-sm">Gestión de proyectos y desarrollos activos</p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton height="h-20" lines={4} />
      ) : projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((p: any) => (
            <Card key={p.id} className="flex justify-between items-center gap-4 bg-dark-800 border-dark-700">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="text-white font-bold text-lg">{p.titulo}</p>
                  <Badge variant={statusVariant[p.estado] || 'info'}>
                    {p.estado}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">{p.descripcion}</p>
                {p.presupuesto && (
                  <p className="text-xs text-primary-400 font-medium">
                    Presupuesto: ${Number(p.presupuesto).toLocaleString()} COP
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleteMutation.isPending && deleteMutation.variables === p.id}
                  onClick={() => {
                    if (confirm(`¿Estás seguro de eliminar el proyecto "${p.titulo}"?`)) {
                      deleteMutation.mutate(p.id);
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
          No hay proyectos registrados.
        </Card>
      )}
    </div>
  );
}
