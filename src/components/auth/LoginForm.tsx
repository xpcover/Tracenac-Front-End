import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ApiService from '@/services/api.service';
import toast from 'react-hot-toast';

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: LoginFormData) =>
      ApiService.post('/admin/superadmin-login', data),

    onSuccess: (response) => {
      const { data } = response;

      toast.success('Login successful');
      // Store user data
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('tenantId', data?.tenantId || '');
      localStorage.setItem('userId', data?.id);
      localStorage.setItem('userRole', data?.userRole);
      localStorage.setItem('email', data?.email);
      localStorage.setItem('token', data?.token);

      navigate('/dashboard');
    },

    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error('Login failed');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                className="pl-10"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}