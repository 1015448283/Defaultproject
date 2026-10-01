import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../../services/projectService';
import { Card, Badge, Button, Skeleton } from '../../components/common';
import { toast } from 'sonner';

export default function Appointments() {
  const queryClient = useQueryClient();
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['agendamientos'],
    queryFn: async () => {
      const res = await appointmentService.getAgendamientos();
      return res?.data ?? [];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: string }) => {
      const res = await appointmentService.updateAgendamiento(id, { estado });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamientos'] });
      toast.success('Estado del agendamiento actualizado');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al actualizar el agendamiento');
    }
  });

  const statusVariants: Record<string, string> = {
    programada: 'pending',
    confirmada: 'success',
    completada: 'info',
    cancelada: 'error'
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Agendamientos y Citas</h1>
        <p className="text-gray-400 text-sm">Citas solicitadas por clientes y prospectos</p>
      </div>

      {isLoading ? (
        <Skeleton height="h-20" lines={4} />
      ) : appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((a: any) => (
            <Card key={a.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-800 border-dark-700">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="text-white font-bold text-lg">{a.email || 'Cliente'}</p>
                  <Badge variant={statusVariants[a.estado] || 'info'}>
                    {a.estado}
                  </Badge>
                </div>
                <p className="text-primary-400 font-medium text-sm">
                  📅 {new Date(a.fecha_hora).toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
                <p className="text-gray-400 text-xs">
                  Tipo: {a.tipo} • Duración: {a.duracion} min
                </p>
                {a.notas && (
                  <p className="text-gray-300 text-xs bg-dark-900/60 p-2.5 rounded-lg border border-dark-700 mt-2">
                    Notas: {a.notas}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {a.estado === 'programada' && (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ id: a.id, estado: 'confirmada' })}
                  >
                    Confirmar Cita
                  </Button>
                )}
                {a.estado === 'confirmada' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ id: a.id, estado: 'completada' })}
                  >
                    Completar
                  </Button>
                )}
                {a.estado !== 'cancelada' && a.estado !== 'completada' && (
                  <Button
                    variant="danger"
                    size="sm"
                    loading={updateMutation.isPending}
                    onClick={() => {
                      if (confirm('¿Deseas cancelar esta cita?')) {
                        updateMutation.mutate({ id: a.id, estado: 'cancelada' });
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 text-gray-400">
          No hay citas agendadas por el momento.
        </Card>
      )}
    </div>
  );
}
