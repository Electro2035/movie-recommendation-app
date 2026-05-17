import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white relative overflow-hidden flex">
      
      {/* LAYER 1: GAMBAR BACKGROUND KIRI */}
      <div className="absolute inset-0 w-full h-full bg-[#181818] z-0">
        <Image 
          src="/assets/bg-login.jpeg" 
          alt="Movies Collage"
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
          className="object-cover opacity-50" 
        />
      </div>

      {/* LAYER 2: PEMISAH SEGITIGA DIAGONAL */}
      <div className="hidden lg:block absolute -top-[20%] -bottom-[20%] -right-[15%] w-[65%] bg-[#0A0A0A] -skew-x-[12deg] z-10 border-l-[1.5px] border-[#f5a623]/40 shadow-[-30px_0_60px_rgba(229,9,20,0.4)]"></div>

      {/* LAYER 3: KONTEN UTAMA */}
      <div className="relative z-20 flex w-full h-screen">
        
        {/* SISI KIRI: Teks Fitur */}
        <div className="hidden lg:flex flex-col justify-center w-[45%] px-12 xl:px-20 pointer-events-none">
          <div className="space-y-10 max-w-sm">
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

        {/* SISI KANAN: Form Register */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12">
          
          <div className="w-full max-w-[440px] p-[1.5px] rounded-[24px] bg-gradient-to-br from-[#E50914] via-[#f5a623]/50 to-white/5 shadow-[0_0_40px_rgba(229,9,20,0.15)] relative">
            
            <div className="w-full h-full bg-[#121212] p-8 sm:p-10 rounded-[23px] relative overflow-hidden">

              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-gray-400 text-sm mb-8">Join Arunika to start personalizing your movies.</p>
              
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}
              
              <div className="space-y-3 mb-6">
                <button type="button" className="w-full flex items-center justify-center gap-3 bg-transparent border border-white/10 hover:bg-white/5 text-white text-sm font-medium py-3 rounded-xl transition">
                  <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button>
                <button type="button" className="w-full flex items-center justify-center gap-3 bg-transparent border border-white/10 hover:bg-white/5 text-white text-sm font-medium py-3 rounded-xl transition">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.48-.7 1.56.02 2.81.69 3.64 1.7-3.13 1.83-2.6 5.96.44 7.06-.69 1.76-1.57 3.2-2.64 4.11zm-3.53-15.6c-.63 1.6-2.26 2.65-3.8 2.55.15-1.68 1.34-3.09 2.92-3.52.57 1.5 1.5 2.57.88.97z"/></svg>
                  Continue with Apple
                </button>
              </div>

              <div className="relative flex items-center py-2 mb-6">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 px-4 text-xs text-gray-500 uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>
              
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Username</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full px-4 py-3.5 rounded-xl bg-[#1A1A1A] border border-white/5 focus:border-red-500/50 focus:ring-1 focus:ring-red-500 outline-none transition text-sm text-white"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">👤</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      className="w-full px-4 py-3.5 rounded-xl bg-[#1A1A1A] border border-white/5 focus:border-red-500/50 focus:ring-1 focus:ring-red-500 outline-none transition text-sm text-white"
                      placeholder="name@example.com"
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
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">👁️</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-[#E50914] to-[#B81D24] hover:from-[#f40612] hover:to-[#E50914] text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-red-500/20 mt-6 text-sm flex justify-center items-center gap-2">
                  Create Account <span className="text-lg leading-none">→</span>
                </button>
              </form>
              
              <p className="mt-8 text-center text-xs text-gray-400">
                Already have an account? <Link href="/login" className="text-red-500 font-medium hover:text-red-400 transition ml-1">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}