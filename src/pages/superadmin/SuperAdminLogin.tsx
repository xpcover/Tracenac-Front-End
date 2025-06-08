import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import ApiService from '@/services/api.service';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '@/redux/slices/authSlice';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import Input from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import Button from '@/components/ui/Button';

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

  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch()

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/dashboard')
    } 
  },[navigate, isAuthenticated])

  const mutation= useMutation({
    mutationFn: (data: LoginFormData) => ApiService.post('/admin/superadmin-login',data),

    onSuccess: (response) => {
      const { msg } = response;
      dispatch(setUserInfo(msg))
      Cookies.set('token', msg?.token);
      localStorage.setItem('token', msg?.token);
      toast.success('Login successful');
      navigate('/dashboard');
    },

    onError: (error:any) => {
      toast.error(error.response.data.err);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
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
              <ErrorMessage>{errors.email?.message}</ErrorMessage>
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
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}