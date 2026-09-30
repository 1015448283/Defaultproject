import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../../services/projectService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Card';
import { toast } from 'sonner';

export default function ServicesAdmin() {
  const queryClient = useQueryClient();
  const { data: services, loading } = useQuery({ queryKey: ['servicios'], queryFn: () => serviceService.getServicios().then(r => r.data) });
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Gestión de Servicios</h1>
      {loading ? <div className="animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-dark-700 rounded mb-2" />)}</div> : (
        <div className="space-y-2">
          {services?.map((s: any) => (
            <Card key={s.id} className="flex justify-between items-center">
              <div>
                <p className="text-white font-bold">{s.nombre}</p>
                <p className="text-gray-500 text-sm">${s.precio_base?.toLocaleString()} COP</p>
              </div>
              <Badge variant={s.activo ? 'success' : 'warning'}>{s.activo ? 'Activo' : 'Inactivo'}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
