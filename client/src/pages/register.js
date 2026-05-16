import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, email, password });
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-surface p-8 rounded-[24px] shadow-xl w-full max-w-md border border-black/5 dark:border-white/5 transition-colors">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-light-text-secondary dark:text-text-secondary text-center mb-8 text-sm">Join Arunika to start personalizing your movies.</p>
        
        {error && <div className="bg-primary/10 text-primary p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-background border-none focus:ring-2 focus:ring-primary outline-none transition"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-background border-none focus:ring-2 focus:ring-primary outline-none transition"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-background border-none focus:ring-2 focus:ring-primary outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-primary/20 mt-4">
            Create Account
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-light-text-secondary dark:text-text-secondary">
          Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}