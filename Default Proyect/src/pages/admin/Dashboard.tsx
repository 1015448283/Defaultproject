import { useQuery } from '@tanstack/react-query';
import { metricsService } from '../../services/projectService';
import { Card } from '../../components/common';

export default function Dashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const res = await metricsService.getDashboardMetrics();
      return res?.data ?? {};
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Resumen de métricas y actividad en tiempo real</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-dark-800 border border-dark-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Contactos este mes</h3>
            <p className="text-3xl font-extrabold text-white">{metrics?.contactos_mes ?? 0}</p>
          </Card>
          <Card className="border-l-4 border-l-indigo-500">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Proyectos activos</h3>
            <p className="text-3xl font-extrabold text-white">{metrics?.proyectos_activos ?? 0}</p>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Pagos recibidos</h3>
            <p className="text-3xl font-extrabold text-white">
              ${Number(metrics?.pagos_recibidos ?? 0).toLocaleString()} <span className="text-xs font-normal text-gray-400">COP</span>
            </p>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Citas próximas</h3>
            <p className="text-3xl font-extrabold text-white">{metrics?.agendamientos_proximos ?? 0}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
