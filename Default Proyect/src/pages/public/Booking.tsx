import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services/projectService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button, Input, TextArea } from '../../components/common';

const BookingSchema = z.object({
  fecha_hora: z.string().min(1, 'Selecciona la fecha y hora de la cita'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  duracion: z.number().min(15).max(120).default(30),
  tipo: z.string().default('reunion_inicial'),
  notas: z.string().optional(),
});

type BookingForm = z.infer<typeof BookingSchema>;

export default function Booking() {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', today, nextWeek],
    queryFn: async () => {
      const res = await appointmentService.getSlotsDisponibles(today, nextWeek);
      return res?.data ?? [];
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BookingForm>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      duracion: 30,
      tipo: 'reunion_inicial'
    }
  });

  const onSubmit = async (data: BookingForm) => {
    try {
      const isoDate = new Date(data.fecha_hora).toISOString();
      const { error } = await appointmentService.createAgendamiento({
        ...data,
        fecha_hora: isoDate
      });

      if (error) throw error;
      toast.success('¡Solicitud de cita enviada! Te confirmaremos por correo.');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Error al solicitar la cita. Verifica los datos.');
    }
  };

  return (
    <div className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Agendar Cita</h1>
          <p className="text-gray-400">
            Agenda una videollamada de 30 minutos para analizar tus requerimientos de frontend o base de datos.
          </p>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Fecha y Hora de la Cita *"
              type="datetime-local"
              {...register('fecha_hora')}
              error={errors.fecha_hora?.message}
            />

            <Input
              label="Tu Correo Electrónico *"
              type="email"
              placeholder="juan@empresa.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">Duración</label>
                <select
                  {...register('duracion', { valueAsNumber: true })}
                  className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value={30}>30 minutos</option>
                  <option value={60}>60 minutos</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">Tipo de Sesión</label>
                <select
                  {...register('tipo')}
                  className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="reunion_inicial">Reunión Inicial</option>
                  <option value="asesoria_tecnica">Asesoría Técnica</option>
                  <option value="seguimiento">Seguimiento de Proyecto</option>
                </select>
              </div>
            </div>

            <TextArea
              label="Notas o Temas a Tratar"
              {...register('notas')}
              placeholder="Cuéntame brevemente qué te gustaría tratar en la reunión..."
              rows={3}
              error={errors.notas?.message}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="mt-2 w-full"
            >
              {isSubmitting ? 'Enviando solicitud...' : 'Confirmar Solicitud de Cita'}
            </Button>
          </form>

          {slotsLoading && (
            <div className="mt-6 pt-6 border-t border-dark-700 text-center text-gray-400 text-xs animate-pulse">
              Consultando disponibilidad en tiempo real...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
