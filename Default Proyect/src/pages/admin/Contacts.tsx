import { useQuery } from '@tanstack/react-query';
import { contactService } from '../../services/contactService';
import { Card, Badge, Skeleton } from '../../components/common';

export default function Contacts() {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contactos'],
    queryFn: async () => {
      const res = await contactService.getContactos();
      return res?.data ?? [];
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Contactos y Leads</h1>
        <p className="text-gray-400 text-sm">Mensajes recibidos desde el formulario web</p>
      </div>

      {isLoading ? (
        <Skeleton height="h-20" lines={4} />
      ) : contacts && contacts.length > 0 ? (
        <div className="space-y-4">
          {contacts.map((c: any) => (
            <Card key={c.id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-dark-800 border-dark-700">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="text-white font-bold text-lg">{c.nombre}</p>
                  <Badge variant="info">{c.fuente || 'web'}</Badge>
                </div>
                <p className="text-gray-400 text-sm">{c.email} {c.telefono ? `• ${c.telefono}` : ''} {c.empresa ? `• ${c.empresa}` : ''}</p>
                {c.mensaje && (
                  <p className="text-gray-300 text-sm bg-dark-900/60 p-3 rounded-lg border border-dark-700 mt-2">
                    {c.mensaje}
                  </p>
                )}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {c.created_at ? new Date(c.created_at).toLocaleDateString('es-CO') : ''}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 text-gray-400">
          No hay contactos registrados todavía.
        </Card>
      )}
    </div>
  );
}
