import { useQuery } from '@tanstack/react-query';
import { metricsService } from '../../services/projectService';
import { Card } from '../../components/common/Card';

export default function Dashboard() {
  const { data: metrics, loading } = useQuery({ queryKey: ['metrics'], queryFn: () => metricsService.getDashboardMetrics().then(r => r.data) });
  if (loading) return <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-dark-700 rounded-lg animate-pulse" />)}</div>;
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><h3 className="text-gray-400 text-sm">Contactos este mes</h3><p className="text-3xl font-bold text-white">{metrics?.contactos_mes || 0}</p></Card>
        <Card><h3 className="text-gray-400 text-sm">Proyectos activos</h3><p className="text-3xl font-bold text-white">{metrics?.proyectos_activos || 0}</p></Card>
        <Card><h3 className="text-gray-400 text-sm">Pagos recibidos</h3><p className="text-3xl font-bold text-white">${metrics?.pagos_recibidos?.toLocaleString() || 0}</p></Card>
        <Card><h3 className="text-gray-400 text-sm">Citas próximas</h3><p className="text-3xl font-bold text-white">{metrics?.agendamientos_proximos || 0}</p></Card>
      </div>
    </div>
  );
}
