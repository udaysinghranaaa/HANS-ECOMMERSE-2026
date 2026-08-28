import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '@/admin/store/adminAuthSlice';
import { useAdminLoginMutation } from '@/services/adminAuthApi';

const loginSchema = z.object({
  email: z.string().trim().email('A valid admin email is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated,
  );
  const [adminLogin] = useAdminLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    try {
      const response = await adminLogin({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();

      dispatch(
        login({
          admin: response.data.admin,
          token: response.data.token,
        }),
      );
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      setError('root', {
        message:
          error?.data?.message || 'Invalid email or password. Please try again.',
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="relative hidden flex-1 overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900">
            <Sun className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="max-w-md text-4xl font-bold leading-tight">
            Powering clean energy management
          </h1>
          <p className="mt-4 max-w-lg text-lg text-slate-300">
            Manage products, categories, and customer enquiries for the HANS
            Solar website from one professional dashboard.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:max-w-xl lg:px-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl sm:p-10">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900">
              <Sun className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-white">HANS Solar Admin</h1>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to manage your website
            </p>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to your admin account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="hanssolarenergy@gmail.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  {...register('password')}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errors.root && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-sm font-semibold text-slate-900 transition hover:from-amber-300 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Secure admin access powered by the HANS Solar backend.
          </p>
        </div>
      </div>
    </div>
  );
}
