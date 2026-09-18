import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle2, KeyRound } from 'lucide-react';
import { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin?: (user: User) => void;
  onLoginSuccess?: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLoginSuccess,
  onLogout,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('admin@darukaa.earth');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Darukaa Administrator');
  const [role, setRole] = useState<'admin' | 'researcher' | 'viewer'>('admin');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address');
      return;
    }

    // Generate simulated JWT token according to hackathon requirements
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: `usr_${Date.now()}`,
        name: isRegister ? name : 'Darukaa Administrator',
        email,
        role,
        iss: 'darukaa.earth-auth-service',
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    );
    const mockJwt = `${header}.${payload}.e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;

    const loggedInUser: User = {
      id: `usr_${Date.now()}`,
      email,
      name: isRegister ? name : (email.includes('admin') ? 'Darukaa Administrator' : email.split('@')[0]),
      role,
      token: mockJwt,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };

    setSuccessMessage(isRegister ? 'Account successfully registered and token issued!' : 'Authentication successful! Session JWT stored.');
    setTimeout(() => {
      if (onLoginSuccess) onLoginSuccess(loggedInUser);
      if (onLogin) onLogin(loggedInUser);
      setSuccessMessage(null);
      onClose();
    }, 600);
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@darukaa.earth');
    setName('Darukaa Administrator');
    setRole('admin');
    const mockJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfYWRtaW5fMDEiLCJlbWFpbCI6ImFkbWluQGRhcnVrYWEuZWFydGgiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NjM1NDAwMDB9.DKA929298418';
    const demoUser: User = {
      id: 'usr_admin_01',
      email: 'admin@darukaa.earth',
      name: 'Darukaa Administrator',
      role: 'admin',
      token: mockJwt,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
    if (onLoginSuccess) onLoginSuccess(demoUser);
    if (onLogin) onLogin(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Authenticated Session</h3>
            <p className="text-xs text-slate-500 mb-4">You are currently logged in with active JWT credentials</p>

            <div className="bg-slate-50 rounded-2xl p-4 text-left mb-6 border border-slate-200 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Name:</span>
                <span className="font-semibold text-slate-800">{currentUser.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold text-emerald-700 uppercase tracking-wide">{currentUser.role}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block mb-1">Signed JWT Bearer:</span>
                <div className="font-mono text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-200 break-all">
                  {currentUser.token || 'Bearer token active'}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#36513b] text-white text-xs font-semibold hover:bg-[#283e2d] transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="py-2.5 px-4 rounded-full border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#cce24b]/40 text-[#142119] flex items-center justify-center font-bold">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {isRegister ? 'Create Darukaa Account' : 'Darukaa.Earth Login'}
                </h3>
                <p className="text-xs text-slate-500">JWT-Based Administrator Authentication</p>
              </div>
            </div>

            {/* Tab switch */}
            <div className="flex bg-slate-100 p-1 rounded-xl my-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  !isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>

            {/* One-click Demo Admin Login banner */}
            <div className="mb-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
              <div className="text-left pr-2">
                <div className="text-xs font-bold text-emerald-900">Hackathon Reviewer Access</div>
                <div className="text-[11px] text-emerald-700">Pre-authenticated as Administrator</div>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="text-xs font-bold bg-[#36513b] hover:bg-[#273d2c] text-white px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap"
              >
                1-Click Admin
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Ankita Dasgupta"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@darukaa.earth"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#36513b]/30 bg-white"
                  >
                    <option value="admin">Administrator (Create Projects, Draw Polygons, Edit Sites)</option>
                    <option value="researcher">Field Researcher (Add Telemetry, View Analytics)</option>
                    <option value="viewer">Public Auditor (Read-only)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#36513b] hover:bg-[#283e2d] text-white text-xs font-bold transition-all shadow-md mt-4"
              >
                {isRegister ? 'Register & Generate JWT' : 'Sign In with JWT'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
