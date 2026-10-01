import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactService } from '../../services/contactService';
import { toast } from 'sonner';
import { Button, Input, TextArea } from '../../components/common';

const ContactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Ingresa un correo electrónico válido'),
  telefono: z.string().optional(),
  empresa: z.string().optional(),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactForm = z.infer<typeof ContactSchema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactForm>({
    resolver: zodResolver(ContactSchema)
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      const { error } = await contactService.createContacto(data);
      if (error) throw error;
      toast.success('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar el mensaje. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Contacto</h1>
          <p className="text-gray-400">
            ¿Tienes una idea o proyecto en mente? Escríbeme y hablemos de cómo hacerlo realidad.
          </p>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Nombre Completo *"
              {...register('nombre')}
              placeholder="Ej: Juan Pérez"
              error={errors.nombre?.message}
            />

            <Input
              label="Correo Electrónico *"
              type="email"
              {...register('email')}
              placeholder="juan@empresa.com"
              error={errors.email?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Teléfono"
                {...register('telefono')}
                placeholder="+57 300 123 4567"
                error={errors.telefono?.message}
              />
              <Input
                label="Empresa"
                {...register('empresa')}
                placeholder="Nombre de empresa"
                error={errors.empresa?.message}
              />
            </div>

            <TextArea
              label="Mensaje o Requerimientos *"
              {...register('mensaje')}
              placeholder="Cuéntame sobre tu proyecto, objetivos y plazos estimados..."
              rows={4}
              error={errors.mensaje?.message}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="mt-2 w-full"
            >
              {isSubmitting ? 'Enviando requerimiento...' : 'Enviar Mensaje'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
