import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { GoogleLogin } from '@react-oauth/google';

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
        window.dispatchEvent(new Event("login-success"));
        router.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google-login', { 
        token: credentialResponse.credential 
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        window.dispatchEvent(new Event("login-success"));
        router.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Google Login failed");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#0A0A0A] text-white relative overflow-hidden">
      
      {/* ========================================= */}
      {/* SISI KIRI: BACKGROUND GAMBAR & DIAGONAL CUT */}
      {/* ========================================= */}
      <div className="hidden lg:block absolute inset-y-0 left-0 w-[55%] z-0 overflow-hidden">
        
        <Image 
          src="/assets/bg-login.jpeg" 
          alt="Movies Collage"
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
          className="object-cover opacity-50" 
        />
                  
        <div className="absolute inset-0 bg-[#0A0A0A]/40"></div>
        
        <div className="absolute -top-20 -bottom-20 -right-[20%] w-[40%] bg-[#0A0A0A] -skew-x-[12deg] border-l border-[#f5a623]/30 shadow-[-15px_0_30px_rgba(229,9,20,0.15)] z-10"></div>
      </div>

      <div className="relative z-10 hidden lg:flex flex-col justify-center w-[50%] px-16 xl:px-24">
        <div className="space-y-10 max-w-sm pointer-events-none">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center text-red-500 shrink-0 shadow-[0_0_15px_rgba(229,9,20,0.2)]">
              🎬
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Curated for You</h3>
              <p className="text-gray-400 text-sm">Personalized recommendations based on your taste.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center text-red-500 shrink-0 shadow-[0_0_15px_rgba(229,9,20,0.2)]">
              🔖
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Keep Your Watchlist</h3>
              <p className="text-gray-400 text-sm">Save movies and shows you don't want to miss.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center text-red-500 shrink-0 shadow-[0_0_15px_rgba(229,9,20,0.2)]">
              👥
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Join the Community</h3>
              <p className="text-gray-400 text-sm">Connect with fellow movie lovers and share your thoughts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* SISI KANAN: FORM LOGIN DENGAN BORDER GLOW   */}
      {/* ========================================= */}
      <div className="relative z-10 w-full lg:w-[50%] flex items-center justify-center p-6 sm:p-12 ml-auto">
        
        <div className="w-full max-w-[440px] p-[1.5px] rounded-[24px] bg-gradient-to-br from-[#E50914] via-[#f5a623]/50 to-white/5 shadow-[0_0_40px_rgba(229,9,20,0.15)] relative">
          
          <div className="w-full h-full bg-[#121212] p-8 sm:p-10 rounded-[23px] relative overflow-hidden">
            
            <div className="absolute top-6 right-6 w-24 h-24 opacity-90 pointer-events-none hidden sm:block">
              {/* <Image src="/assets/director-chair-1.png" fill className="object-contain" alt="Chair" /> */}
            </div>

            <h2 className="text-3xl font-bold mb-2">Hello Again!</h2>
            <p className="text-gray-400 text-sm mb-8">Welcome back to your movie world.</p>
            
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}
            
            <div className="space-y-3 mb-6">
              <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Login Failed")}
                  theme="filled_black"
                  shape="rectangular"
                  text="continue_with"
                />
              </div>
            </div>

            <div className="relative flex items-center py-2 mb-6">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 px-4 text-xs text-gray-500 uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    className="w-full px-4 py-3.5 rounded-xl bg-[#1A1A1A] border border-white/5 focus:border-red-500/50 focus:ring-1 focus:ring-red-500 outline-none transition text-sm text-white"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">✉️</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full px-4 py-3.5 rounded-xl bg-[#1A1A1A] border border-white/5 focus:border-red-500/50 focus:ring-1 focus:ring-red-500 outline-none transition text-sm text-white"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">👁️</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1A1A1A] text-red-500 focus:ring-red-500 focus:ring-offset-0 accent-red-500" />
                  <span className="text-xs text-gray-400">Remember me</span>
                </label>
                <button type="button" className="text-xs text-red-500 hover:text-red-400 transition">Forgot password?</button>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-[#E50914] to-[#B81D24] hover:from-[#f40612] hover:to-[#E50914] text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-red-500/20 mt-6 text-sm flex justify-center items-center gap-2">
                Log In <span className="text-lg leading-none">→</span>
              </button>
            </form>
            
            <p className="mt-8 text-center text-xs text-gray-400">
              Don't have an account? <Link href="/register" className="text-red-500 font-medium hover:text-red-400 transition ml-1">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}