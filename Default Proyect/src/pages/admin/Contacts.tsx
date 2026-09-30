import { useQuery } from '@tanstack/react-query';
import { contactService } from '../../services/contactService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Card';

export default function Contacts() {
  const { data: contacts, loading } = useQuery({ queryKey: ['contactos'], queryFn: () => contactService.getContactos().then(r => r.data) });
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Contactos</h1>
      {loading ? <div className="animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-dark-700 rounded mb-2" />)}</div> : (
        <div className="space-y-2">
          {contacts?.map((c: any) => (
            <Card key={c.id} className="flex justify-between items-center">
              <div>
                <p className="text-white font-bold">{c.nombre}</p>
                <p className="text-gray-500 text-sm">{c.email}</p>
              </div>
              <Badge variant="info">{c.fuente}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
