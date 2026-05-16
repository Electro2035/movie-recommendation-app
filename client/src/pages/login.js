import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        router.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300 bg-[#F7F3EF] dark:bg-[#151515]">
      <div className="bg-white dark:bg-surface p-8 rounded-[24px] shadow-xl w-full max-w-md border border-black/5 dark:border-white/5 transition-colors">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-light-text-secondary dark:text-text-secondary text-center mb-8 text-sm">Please enter your details to sign in.</p>
        
        {error && <div className="bg-primary/10 text-primary p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
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
            Sign In
          </button>
        </form>
        
        <div className="mt-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-white/10"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-surface text-light-text-secondary dark:text-text-secondary">Or continue with</span></div>
          </div>
          
          <button type="button" className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 dark:bg-background dark:hover:bg-background/80 text-light-text dark:text-white font-medium py-3 rounded-xl transition border border-black/5 dark:border-white/5">
            <img src="https://authjs.dev/img/providers/google.svg" alt="Google Logo" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
        
        <p className="mt-8 text-center text-sm text-light-text-secondary dark:text-text-secondary">
          Don't have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}