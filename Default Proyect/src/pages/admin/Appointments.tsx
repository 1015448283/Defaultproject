import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../../services/projectService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Card';
import { toast } from 'sonner';

export default function Appointments() {
  const queryClient = useQueryClient();
  const { data: appointments, loading } = useQuery({ queryKey: ['agendamientos'], queryFn: () => appointmentService.getAgendamientos().then(r => r.data) });
  const updateMutation = useMutation({ mutationFn: (id: string) => appointmentService.updateAgendamiento(id, { estado: 'confirmada' }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamientos'] }), onError: () => toast.error('Error') });
  const statusVariants: Record<string, string> = { programada: 'pending', confirmada: 'success', completada: 'success', cancelada: 'error' };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Agendamientos</h1>
      {loading ? <div className="animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-dark-700 rounded mb-2" />)}</div> : (
        <div className="space-y-2">
          {appointments?.map((a: any) => (
            <Card key={a.id} className="flex justify-between items-center">
              <div>
                <p className="text-white font-bold">{a.nombre || a.contacto_id}</p>
                <p className="text-gray-500 text-sm">{new Date(a.fecha_hora).toLocaleString('es-ES')}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge variant={statusVariants[a.estado] || 'info'}>{a.estado}</Badge>
                {a.estado === 'programada' && <button onClick={() => updateMutation.mutate(a.id)} className="bg-green-600 px-3 py-1 rounded text-sm">Confirmar</button>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
