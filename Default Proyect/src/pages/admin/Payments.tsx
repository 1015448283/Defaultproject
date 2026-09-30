import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../../services/projectService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Card';

export default function Payments() {
  const { data: payments, loading } = useQuery({ queryKey: ['pagos'], queryFn: () => paymentService.getPagos().then(r => r.data) });
  const variants: Record<string, string> = { pendiente: 'pending', completado: 'success', fallido: 'error', reembolsado: 'warning' };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Pagos</h1>
      {loading ? <div className="animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-dark-700 rounded mb-2" />)}</div> : (
        <div className="space-y-2">
          {payments?.map((p: any) => (
            <Card key={p.id} className="flex justify-between items-center">
              <div>
                <p className="text-white font-bold">${p.monto?.toLocaleString()} {p.moneda}</p>
                <p className="text-gray-500 text-sm">Proyecto: {p.proyecto_id}</p>
              </div>
              <Badge variant={variants[p.estado] || 'info'}>{p.estado}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
