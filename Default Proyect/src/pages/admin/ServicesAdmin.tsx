import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../../services/projectService';
import { Card, Badge, Button, Skeleton } from '../../components/common';
import { toast } from 'sonner';

export default function ServicesAdmin() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useQuery({
    queryKey: ['servicios-admin'],
    queryFn: async () => {
      const res = await serviceService.getServicios();
      return res?.data ?? [];
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, activo }: { id: string; activo: boolean }) => {
      const res = await serviceService.updateServicio(id, { activo });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios-admin'] });
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      toast.success('Estado del servicio actualizado');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al actualizar servicio');
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Gestión de Servicios</h1>
        <p className="text-gray-400 text-sm">Administra los servicios técnicos visibles en la web</p>
      </div>

      {isLoading ? (
        <Skeleton height="h-20" lines={4} />
      ) : services && services.length > 0 ? (
        <div className="space-y-4">
          {services.map((s: any) => (
            <Card key={s.id} className="flex justify-between items-center gap-4 bg-dark-800 border-dark-700">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="text-white font-bold text-lg">{s.nombre}</p>
                  <Badge variant={s.activo ? 'success' : 'warning'}>
                    {s.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">{s.descripcion}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {s.precio_base && <span>Precio: ${Number(s.precio_base).toLocaleString()} COP</span>}
                  {s.duracion_estimada && <span>Duración: {s.duracion_estimada} días</span>}
                </div>
              </div>
              <Button
                variant={s.activo ? 'secondary' : 'primary'}
                size="sm"
                loading={toggleMutation.isPending && toggleMutation.variables?.id === s.id}
                onClick={() => toggleMutation.mutate({ id: s.id, activo: !s.activo })}
              >
                {s.activo ? 'Desactivar' : 'Activar'}
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 text-gray-400">
          No hay servicios registrados.
        </Card>
      )}
    </div>
  );
}
