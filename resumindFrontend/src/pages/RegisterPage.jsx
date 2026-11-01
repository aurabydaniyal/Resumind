import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ElectricLogo from '../components/react-bits/ElectricLogo';
import GlassSurface from '../components/react-bits/GlassSurface';
import { User, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <GlassSurface borderRadius={24} className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <ElectricLogo size={48} />
          </div>
          <div className="font-extrabold text-xl tracking-tight flex items-center justify-center gap-1 mb-1">
            <span className="text-white">Resumind</span>
            <span className="text-[#0466c8]">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-[#979dac] mt-1">
            Build, evaluate, and export professional ATS-ready resumes
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#979dac] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7d8597]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Qasim Ali"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#979dac] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7d8597]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="qasim@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#979dac] uppercase tracking-wider mb-1.5">
              Password (min. 8 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7d8597]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white btn-3d disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#33415c]/50 text-center text-xs text-[#979dac]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#3b9eff] hover:text-white transition-colors">
            Sign in
          </Link>
        </div>
      </GlassSurface>
    </div>
  );
}
