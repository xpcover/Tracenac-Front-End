import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Lock, User } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import axios from 'axios';
import { axiosInstance } from '@/config/axiosInstance';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // role: 'employee',
  });
  const [error, setError] = useState<string | null>(null);

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
  
    const url = formData.role === 'admin'?  "/tenant/authenticate": "/user/auth"
    try {
      const response = await axiosInstance.post(
        url,
        formData, // formData should contain { email, password, ... }
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const data = response.data; // axios auto parses JSON
  
      console.log('Authentication successful:', data);
  
      // Save data in local storage
      localStorage.setItem('user', JSON.stringify(data.msg));
      localStorage.setItem('tenantId', data.msg.tenantId);
      localStorage.setItem('userId', data.msg.id);
      localStorage.setItem('userRole', data.msg.userRole);
      localStorage.setItem('email', data.msg.email);
      localStorage.setItem('token', data.msg.token);
  
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error during authentication:', error);
      setError('Authentication failed. Please check your credentials and try again.');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Role Selector */}
            <div>
              <select
                className="w-full border px-4 py-2 rounded-md text-gray-700"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                className="pl-10"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}