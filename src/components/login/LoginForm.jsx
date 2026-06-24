import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FormGroup, FormLabel, FormInput } from '../ui/FormField';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import RegisterHeader from '../register/RegisterHeader';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/requests';

  // Redirect to the right place based on role
  const getDefaultRoute = (role) => {
    if (role === 'HOSPITAL')  return '/dashboard/hospital';
    if (role === 'DONOR')     return '/requests';
    if (role === 'RECIPIENT') return '/requests';
    return from;
  };

  if (user) {
    console.log("Inside User");
    
    navigate(getDefaultRoute(user.role), { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const loggedIn = await login(email, password);
      navigate(getDefaultRoute(loggedIn.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-slideUp">
      <RegisterHeader title="Welcome back" subtitle="Sign in to check blood requests and your profile" />

      <div className="bg-surface border border-border-subtle rounded-2xl p-8 shadow-sm">
        <div className="bg-primary-light border border-border rounded-lg p-4 mb-5">
          <p className="font-semibold text-sm text-primary-dark mb-3">Quick Demo Login</p>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              className="bg-white hover:bg-gray-50 border-primary/20 text-primary-dark text-xs"
              onClick={() => {
                setEmail('donor@demo.com');
                setPassword('Demo@1234');
                setError('');
              }}
            >
              🩸 Donor
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              className="bg-white hover:bg-gray-50 border-primary/20 text-primary-dark text-xs"
              onClick={() => {
                setEmail('hospital@demo.com');
                setPassword('Demo@1234');
                setError('');
              }}
            >
              🏥 Hospital
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              className="bg-white hover:bg-gray-50 border-primary/20 text-primary-dark text-xs"
              onClick={() => {
                setEmail('patient@demo.com');
                setPassword('Demo@1234');
                setError('');
              }}
            >
              👤 Patient
            </Button>
          </div>
        </div>

        {error && (
          <div role="alert" className="bg-red-light border border-red rounded-lg p-3.5 text-red-dark text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormGroup className="mb-4">
            <FormLabel htmlFor="login-email">Email address</FormLabel>
            <FormInput id="login-email" type="email" icon={Mail} placeholder="you@email.com"
              value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
              autoComplete="email" />
          </FormGroup>

          <FormGroup className="mb-6">
            <div className="flex justify-between items-center">
              <FormLabel htmlFor="login-password">Password</FormLabel>
              <a href="#" className="text-xs text-primary font-semibold">Forgot password?</a>
            </div>
            <div className="relative">
              <FormInput id="login-password" type={showPass ? 'text' : 'password'} icon={Lock}
                placeholder="Your password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password" className="pr-10" />
              <button type="button" onClick={() => setShowPass((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </FormGroup>

          <Button type="submit" variant="primary" size="lg" className="w-full justify-center" disabled={loading}>
            {loading ? <><LoadingSpinner light /> Signing in…</> : <><LogIn size={17} /> Sign In</>}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-text-secondary mt-5">
        New donor? <Link to="/register/donor" className="text-primary font-semibold">Register here →</Link>
      </p>
      <p className="text-center text-sm text-text-secondary mt-2">
        Patient or hospital?{' '}
        <Link to="/register/patient" className="text-cta font-semibold">Create account →</Link>
      </p>
      <p className="text-center text-sm text-text-secondary mt-2">
        Need blood? <Link to="/request/create" className="text-cta font-semibold">Submit a request →</Link>
      </p>
    </div>
  );
}
