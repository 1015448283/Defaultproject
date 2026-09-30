import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services/projectService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const BookingSchema = z.object({
  fecha_hora: z.string().datetime(),
  duracion: z.number().optional(),
  tipo: z.string().optional(),
  notas: z.string().optional(),
  email: z.string().email(),
});
type BookingForm = z.infer<typeof BookingSchema>;

export default function Booking() {
  const { data: slots, loading: slotsLoading } = useQuery({ queryKey: ['slots', new Date().toISOString().split('T')[0]], queryFn: () => appointmentService.getSlotsDisponibles(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]).then(r => r.data) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookingForm>({ resolver: zodResolver(BookingSchema) });

  const onSubmit = async (data: BookingForm) => {
    try {
      const { error } = await appointmentService.createAgendamiento(data);
      if (error) throw error;
      toast.success('Solicitud de cita enviada');
    } catch {
      toast.error('Error al solicitar la cita');
    }
  };

  return (
    <div className="py-16 px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Agendar Cita</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input {...register('fecha_hora')} type="datetime-local" className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          <input {...register('email')} type="email" placeholder="Email" className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          <input {...register('duracion', { valueAsNumber: true })} type="number" placeholder="Duración (min)" className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          <textarea {...register('notas')} placeholder="Notas" rows={3} className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700">
            {isSubmitting ? 'Enviando...' : 'Solicitar Cita'}
          </button>
        </form>
        {slotsLoading && <div className="mt-8"><div className="h-32 bg-dark-700 rounded-lg animate-pulse" /></div>}
      </div>
    </div>
  );
}
