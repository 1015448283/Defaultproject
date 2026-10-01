import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../../services/projectService';
import { Card, Badge, Skeleton } from '../../components/common';

export default function Payments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['pagos'],
    queryFn: async () => {
      const res = await paymentService.getPagos();
      return res?.data ?? [];
    }
  });

  const variants: Record<string, string> = {
    pendiente: 'pending',
    completado: 'success',
    fallido: 'error',
    reembolsado: 'warning'
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Pagos y Transacciones</h1>
        <p className="text-gray-400 text-sm">Registro de cobros procesados mediante Stripe (PSE, Tarjeta, Nequi)</p>
      </div>

      {isLoading ? (
        <Skeleton height="h-20" lines={4} />
      ) : payments && payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((p: any) => (
            <Card key={p.id} className="flex justify-between items-center gap-4 bg-dark-800 border-dark-700">
              <div>
                <p className="text-white font-bold text-xl">
                  ${Number(p.monto).toLocaleString()} <span className="text-sm font-normal text-gray-400">{p.moneda}</span>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Método: {p.metodo_pago || 'Checkout'} {p.stripe_session_id ? `• Ref: ${p.stripe_session_id.slice(0, 16)}...` : ''}
                </p>
                <p className="text-xs text-gray-500">
                  {p.created_at ? new Date(p.created_at).toLocaleString('es-CO') : ''}
                </p>
              </div>
              <Badge variant={variants[p.estado] || 'info'}>
                {p.estado}
              </Badge>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 text-gray-400">
          No hay pagos registrados.
        </Card>
      )}
    </div>
  );
}
