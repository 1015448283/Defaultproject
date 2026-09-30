import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../services/projectService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Card';
import { toast } from 'sonner';

export default function Projects() {
  const queryClient = useQueryClient();
  const { data: projects, loading } = useQuery({ queryKey: ['proyectos'], queryFn: () => projectService.getProyectos().then(r => r.data) });
  const deleteMutation = useMutation({ mutationFn: projectService.deleteProyecto, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proyectos'] }), onError: () => toast.error('Error al eliminar') });
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Proyectos</h1>
      {loading ? <div className="animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-dark-700 rounded mb-2" />)}</div> : (
        <div className="space-y-2">
          {projects?.map((p: any) => (
            <Card key={p.id} className="flex justify-between items-center">
              <div>
                <p className="text-white font-bold">{p.titulo}</p>
                <p className="text-gray-500 text-sm">{p.estado}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => deleteMutation.mutate(p.id)} className="bg-red-600 px-3 py-1 rounded text-sm">Eliminar</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
