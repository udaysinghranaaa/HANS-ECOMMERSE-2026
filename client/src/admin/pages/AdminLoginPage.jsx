import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '@/admin/store/adminAuthSlice';
import { isAdminSessionActive } from '@/admin/utils/adminSession';
import {
  useAdminLoginMutation,
  useAdminTotpEnableMutation,
  useAdminTotpRecoverMutation,
  useAdminTotpSetupMutation,
  useAdminTotpVerifyMutation,
} from '@/services/adminAuthApi';
import { useGetSiteMediaQuery } from '@/services/siteMediaApi';

const BRAND_IMAGE = '/s1.webp';

const loginSchema = z.object({
  email: z.string().trim().email('A valid admin email is required'),
  password: z.string().min(1, 'Password is required'),
});

const totpSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter a valid 6-digit code'),
});

const backupSchema = z.object({
  backupCode: z.string().trim().min(6, 'Enter a valid backup recovery code'),
});

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white py-3 text-charcoal outline-none transition placeholder:text-slate-400 focus:border-solar-400 focus:ring-2 focus:ring-solar-100';

const primaryButtonClassName =
  'w-full rounded-xl bg-solar-600 py-3 text-sm font-semibold text-white shadow-sm shadow-solar-600/25 transition hover:bg-solar-700 disabled:cursor-not-allowed disabled:opacity-70';

function useAdminLogo() {
  const { data: siteMediaResponse } = useGetSiteMediaQuery();
  const logoSrc = siteMediaResponse?.data?.logo ?? '/logo.jpg';
  const [logoError, setLogoError] = useState(false);

  return { logoSrc, logoError, setLogoError };
}

function ErrorBanner({ message }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {message}
    </p>
  );
}

function AdminBrandPanel({ compact = false }) {
  const { logoSrc, logoError, setLogoError } = useAdminLogo();

  if (compact) {
    return (
      <div className="admin-login-brand-compact relative overflow-hidden lg:hidden">
        <img
          src={BRAND_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/88 via-solar-900/75 to-emerald-900/80" />
        <div className="relative px-5 py-6 sm:px-8 sm:py-7">
          {!logoError ? (
            <img
              src={logoSrc}
              alt="HANS Solar Energy"
              className="admin-login-logo h-10 w-auto max-w-[160px] brightness-0 invert object-contain sm:h-11"
              onError={() => setLogoError(true)}
            />
          ) : (
            <p className="text-lg font-bold text-white">HANS Solar Energy</p>
          )}
          <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-white/90">
            Welcome Admin to Our Solar Dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <aside className="admin-login-brand-panel relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-center">
      <img
        src={BRAND_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-solar-900/78 to-emerald-900/82" />
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-solar-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-8 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="admin-login-brand-content relative z-10 flex h-full flex-col justify-center px-10 py-12 xl:px-16 xl:py-16">
        <div className="mx-auto w-full max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-solar-100 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Admin Control Center
          </div>

          <div className="mt-10 rounded-3xl border border-white/15 bg-white/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-8">
            {!logoError ? (
              <img
                src={logoSrc}
                alt="HANS Solar Energy"
                className="admin-login-logo mx-auto h-16 w-auto max-w-[280px] object-contain sm:h-20 sm:max-w-[320px]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <p className="text-center text-3xl font-bold text-solar-700">
                HANS Solar Energy
              </p>
            )}
          </div>

          <h2 className="mt-10 text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
            Welcome Admin to Our Solar Dashboard
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 xl:text-lg">
            Manage your solar business, products, enquiries and customers from one
            professional place — built for trusted solar operations.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {['Products', 'Enquiries', 'Operations'].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center backdrop-blur-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-solar-100">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function AdminLoginLayout({ title, subtitle, children, onBack }) {
  const { logoSrc, logoError, setLogoError } = useAdminLogo();

  return (
    <div className="admin-login-enter min-h-screen bg-white lg:grid lg:grid-cols-2">
      <AdminBrandPanel compact />

      <div className="flex min-h-[calc(100vh-9rem)] flex-col justify-center px-5 py-8 sm:min-h-0 sm:px-10 sm:py-10 lg:min-h-screen lg:px-12 xl:px-16">
        <div className="admin-login-form-panel mx-auto w-full max-w-md">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-light transition hover:text-solar-700"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to sign in
            </button>
          ) : null}

          <div className="mb-8 lg:mb-10">
            {!logoError ? (
              <img
                src={logoSrc}
                alt="HANS Solar Energy"
                className="admin-login-logo h-11 w-auto max-w-[180px] object-contain sm:h-12"
                onError={() => setLogoError(true)}
              />
            ) : (
              <p className="text-xl font-bold text-solar-700">HANS Solar Energy</p>
            )}
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm leading-relaxed text-charcoal-light sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="transition-all duration-300">{children}</div>
        </div>
      </div>

      <AdminBrandPanel />
    </div>
  );
}

export default function AdminLoginPage() {
  const [step, setStep] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingToken, setPendingToken] = useState('');
  const [adminProfile, setAdminProfile] = useState(null);
  const [setupData, setSetupData] = useState(null);
  const [backupCodes, setBackupCodes] = useState([]);
  const [sessionToken, setSessionToken] = useState('');
  const [rootError, setRootError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated,
  );
  const token = useSelector((state) => state.adminAuth.token);

  const [adminLogin, { isLoading: isLoggingIn }] = useAdminLoginMutation();
  const [adminTotpSetup, { isLoading: isSettingUp }] = useAdminTotpSetupMutation();
  const [adminTotpEnable, { isLoading: isEnabling }] = useAdminTotpEnableMutation();
  const [adminTotpVerify, { isLoading: isVerifying }] = useAdminTotpVerifyMutation();
  const [adminTotpRecover, { isLoading: isRecovering }] = useAdminTotpRecoverMutation();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const totpForm = useForm({
    resolver: zodResolver(totpSchema),
    defaultValues: { code: '' },
  });

  const backupForm = useForm({
    resolver: zodResolver(backupSchema),
    defaultValues: { backupCode: '' },
  });

  const completeAuthentication = (payload) => {
    dispatch(
      login({
        admin: payload.admin,
        token: payload.token,
      }),
    );
    navigate('/admin/dashboard', { replace: true });
  };

  const resetToLogin = () => {
    setStep('login');
    setPendingToken('');
    setRootError('');
    totpForm.reset();
    backupForm.reset();
  };

  const beginTotpSetup = async (token) => {
    const response = await adminTotpSetup(token).unwrap();
    setSetupData(response.data);
    setStep('setup');
  };

  const onLoginSubmit = async (values) => {
    setRootError('');

    try {
      const response = await adminLogin({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();

      const { step: authStep, pendingToken: token, admin } = response.data;
      setPendingToken(token);
      setAdminProfile(admin);

      if (authStep === 'setup') {
        await beginTotpSetup(token);
        return;
      }

      setStep('verify');
    } catch (error) {
      setRootError(
        error?.data?.message || 'Invalid email or password. Please try again.',
      );
    }
  };

  const onSetupSubmit = async (values) => {
    setRootError('');

    try {
      const response = await adminTotpEnable({
        pendingToken,
        code: values.code,
      }).unwrap();

      setSessionToken(response.data.token);
      setAdminProfile(response.data.admin);
      setBackupCodes(response.data.backupCodes ?? []);
      setStep('backupCodes');
    } catch (error) {
      setRootError(error?.data?.message || 'Invalid authenticator code.');
    }
  };

  const onVerifySubmit = async (values) => {
    setRootError('');

    try {
      const response = await adminTotpVerify({
        pendingToken,
        code: values.code,
      }).unwrap();

      completeAuthentication(response.data);
    } catch (error) {
      setRootError(error?.data?.message || 'Invalid authenticator code.');
    }
  };

  const onBackupSubmit = async (values) => {
    setRootError('');

    try {
      const response = await adminTotpRecover({
        pendingToken,
        backupCode: values.backupCode.trim().toUpperCase(),
      }).unwrap();

      completeAuthentication(response.data);
    } catch (error) {
      setRootError(error?.data?.message || 'Invalid backup recovery code.');
    }
  };

  if (isAuthenticated && isAdminSessionActive(token)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (step === 'backupCodes') {
    return (
      <AdminLoginLayout
        title="Save Your Backup Recovery Codes"
        subtitle="Store these codes securely. Each code works once if you lose access to your authenticator app."
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-2xl border border-solar-100 bg-solar-50 px-4 py-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-solar-600" />
            <p className="text-sm text-charcoal-light">
              Two-factor authentication is now enabled for your admin account.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {backupCodes.map((code) => (
              <code
                key={code}
                className="rounded-lg bg-white px-3 py-2.5 text-center text-sm font-semibold tracking-wider text-charcoal shadow-sm"
              >
                {code}
              </code>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              completeAuthentication({
                admin: adminProfile,
                token: sessionToken,
              })
            }
            className={primaryButtonClassName}
          >
            Continue to Dashboard
          </button>
        </div>
      </AdminLoginLayout>
    );
  }

  if (step === 'setup') {
    return (
      <AdminLoginLayout
        title="Set Up Two-Factor Authentication"
        subtitle="Scan the QR code with Google Authenticator, Microsoft Authenticator, or Authy."
        onBack={resetToLogin}
      >
        <div className="space-y-5">
          {isSettingUp && !setupData ? (
            <p className="text-sm text-charcoal-light">Preparing QR code...</p>
          ) : null}

          {setupData?.qrCodeDataUrl && (
            <div className="mx-auto w-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
              <img
                src={setupData.qrCodeDataUrl}
                alt="Authenticator QR code"
                className="h-40 w-40 sm:h-44 sm:w-44"
              />
            </div>
          )}

          {setupData?.manualEntryKey && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                Manual setup key
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-charcoal">
                {setupData.manualEntryKey}
              </p>
            </div>
          )}

          <form className="space-y-4" onSubmit={totpForm.handleSubmit(onSetupSubmit)} noValidate>
            <div>
              <label htmlFor="setup-code" className="mb-2 block text-sm font-medium text-charcoal">
                6-digit verification code
              </label>
              <input
                id="setup-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                className={`${inputClassName} px-4 text-center text-lg tracking-[0.35em]`}
                {...totpForm.register('code')}
              />
              {totpForm.formState.errors.code && (
                <p className="mt-1.5 text-sm text-red-600">
                  {totpForm.formState.errors.code.message}
                </p>
              )}
            </div>

            <ErrorBanner message={rootError} />

            <button type="submit" disabled={isEnabling} className={primaryButtonClassName}>
              {isEnabling ? 'Verifying...' : 'Verify & Enable 2FA'}
            </button>
          </form>
        </div>
      </AdminLoginLayout>
    );
  }

  if (step === 'verify') {
    return (
      <AdminLoginLayout
        title="Two-Factor Authentication"
        subtitle="Enter the 6-digit code from your authenticator app."
        onBack={resetToLogin}
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-2xl border border-solar-100 bg-solar-50 px-4 py-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-solar-600" />
            <p className="text-sm text-charcoal-light">
              Secure sign-in required before accessing the dashboard.
            </p>
          </div>

          <form className="space-y-4" onSubmit={totpForm.handleSubmit(onVerifySubmit)} noValidate>
            <div>
              <label htmlFor="verify-code" className="mb-2 block text-sm font-medium text-charcoal">
                Authenticator code
              </label>
              <input
                id="verify-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                className={`${inputClassName} px-4 text-center text-lg tracking-[0.35em]`}
                {...totpForm.register('code')}
              />
              {totpForm.formState.errors.code && (
                <p className="mt-1.5 text-sm text-red-600">
                  {totpForm.formState.errors.code.message}
                </p>
              )}
            </div>

            <ErrorBanner message={rootError} />

            <button type="submit" disabled={isVerifying} className={primaryButtonClassName}>
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          <button
            type="button"
            className="w-full text-sm font-medium text-solar-700 transition hover:text-solar-800"
            onClick={() => {
              setRootError('');
              backupForm.reset();
              setStep('backup');
            }}
          >
            Use a backup recovery code
          </button>
        </div>
      </AdminLoginLayout>
    );
  }

  if (step === 'backup') {
    return (
      <AdminLoginLayout
        title="Backup Recovery Code"
        subtitle="Enter one of your saved backup recovery codes."
        onBack={() => {
          setRootError('');
          setStep('verify');
        }}
      >
        <form className="space-y-4" onSubmit={backupForm.handleSubmit(onBackupSubmit)} noValidate>
          <div>
            <label htmlFor="backup-code" className="mb-2 block text-sm font-medium text-charcoal">
              Recovery code
            </label>
            <input
              id="backup-code"
              autoComplete="off"
              placeholder="XXXX-XXXX"
              className={`${inputClassName} px-4 text-center uppercase tracking-wider`}
              {...backupForm.register('backupCode')}
            />
            {backupForm.formState.errors.backupCode && (
              <p className="mt-1.5 text-sm text-red-600">
                {backupForm.formState.errors.backupCode.message}
              </p>
            )}
          </div>

          <ErrorBanner message={rootError} />

          <button type="submit" disabled={isRecovering} className={primaryButtonClassName}>
            {isRecovering ? 'Verifying...' : 'Verify Recovery Code'}
          </button>
        </form>
      </AdminLoginLayout>
    );
  }

  return (
    <AdminLoginLayout
      title="Welcome Back, Admin"
      subtitle="Sign in to access your HANS Solar Dashboard"
    >
      <form className="space-y-5" onSubmit={loginForm.handleSubmit(onLoginSubmit)} noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-charcoal">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="Enter admin email"
              className={`${inputClassName} pl-11 pr-4`}
              {...loginForm.register('email')}
            />
          </div>
          {loginForm.formState.errors.email && (
            <p className="mt-1.5 text-sm text-red-600">
              {loginForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-charcoal">
            Password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter password"
              className={`${inputClassName} pl-11 pr-12`}
              {...loginForm.register('password')}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-charcoal"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {loginForm.formState.errors.password && (
            <p className="mt-1.5 text-sm text-red-600">
              {loginForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <ErrorBanner message={rootError} />

        <button type="submit" disabled={isLoggingIn} className={primaryButtonClassName}>
          {isLoggingIn ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-xs leading-relaxed text-charcoal-light">
        Protected by two-factor authentication for secure admin access.
      </p>
    </AdminLoginLayout>
  );
}
