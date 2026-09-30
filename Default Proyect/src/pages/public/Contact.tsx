import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactService } from '../../services/contactService';
import { toast } from 'sonner';

const ContactSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  telefono: z.string().optional(),
  empresa: z.string().optional(),
  mensaje: z.string().min(10),
});
type ContactForm = z.infer<typeof ContactSchema>;

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({ resolver: zodResolver(ContactSchema) });

  const onSubmit = async (data: ContactForm) => {
    try {
      const { error } = await contactService.createContacto(data);
      if (error) throw error;
      toast.success('Mensaje enviado correctamente');
    } catch {
      toast.error('Error al enviar el mensaje');
    }
  };

  return (
    <div className="py-16 px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Contacto</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input {...register('nombre')} placeholder="Nombre" className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre.message}</span>}
          <input {...register('email')} type="email" placeholder="Email" className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          <input {...register('telefono')} placeholder="Teléfono" className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          <input {...register('empresa')} placeholder="Empresa" className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          <textarea {...register('mensaje')} placeholder="Mensaje" rows={5} className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          {errors.mensaje && <span className="text-red-500 text-sm">{errors.mensaje.message}</span>}
          <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50">
            {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
}
