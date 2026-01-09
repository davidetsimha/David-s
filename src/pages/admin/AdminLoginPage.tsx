import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { ROUTES } from '../../config/routes';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.ADMIN;

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(201,169,98,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(201,169,98,0.1)_0%,_transparent_40%)]" />

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <span className="font-display text-white text-2xl font-semibold">D</span>
            </div>
            <h1 className="font-display text-2xl text-gray-900">David's Patisserie</h1>
            <p className="text-gray-500 mt-1">Admin Portal</p>
          </div>

          <LoginForm onSuccess={handleSuccess} />

          <p className="text-center text-xs text-gray-400 mt-6">
            Secure admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
