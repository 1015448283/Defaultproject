import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password);
      toast.success('Bienvenido al panel');
      navigate('/admin');
    } catch {
      toast.error('Credenciales inválidas');
    }
  };

  return (
    <div className="bg-dark-800 rounded-xl p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold text-white mb-6">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register('email')} type="email" placeholder="Email" className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        <input {...register('password')} type="password" placeholder="Contraseña" className="bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white" />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700">
          {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
