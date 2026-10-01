import { useAuthStore } from '../../stores/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button, Input } from '../../components/common';

const LoginSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password);
      toast.success('¡Bienvenido al panel de administración!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Acceso Administrativo</h1>
        <p className="text-gray-400 text-sm">Ingresa con tus credenciales de administrador</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="admin@oliverprada.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="mt-2 w-full"
        >
          {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ← Volver a la página principal
        </Link>
      </div>
    </div>
  );
}
