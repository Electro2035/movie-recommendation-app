import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import Image from 'next/image';

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    api.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => router.push('/login'));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setUser({ ...user, avatar: res.data.avatarUrl });
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/auth/update-profile', { name: user.name, avatar: user.avatar });
      alert("Profile updated!");
      window.dispatchEvent(new Event("login-success"));
    } catch (err) {
      alert("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0A0A0A] text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      
      {/* BACKGROUND CINEMATIC */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/bg-login.jpeg" 
          alt="Cinematic Background"
          fill
          priority
          className="object-cover opacity-5 dark:opacity-15 grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-white dark:from-[#0A0A0A]/90 dark:via-[#0A0A0A]/60 dark:to-[#0A0A0A]"></div>
      </div>

      {/* Kontainer Utama yang lebih Ramping (max-w-md) */}
      <main className="relative z-10 max-w-md mx-auto pt-16 px-4 pb-12">
        <h1 className="text-2xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white text-center">
          Settings
        </h1>

        {/* Card dengan Padding lebih kecil (p-6) */}
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-[20px] p-6 border border-black/5 dark:border-white/5 shadow-xl">
          
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              {/* Ukuran Avatar dikecilkan (w-24) */}
              <img 
                src={user.avatar || 'https://via.placeholder.com/150'} 
                className={`w-24 h-24 rounded-full border-2 border-[#C44536] object-cover transition shadow-md ${uploading ? 'opacity-50' : ''}`}
                alt=""
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-[9px] font-bold uppercase tracking-tighter text-white">
                  {uploading ? '...' : 'Change'}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            <h2 className="mt-3 text-lg font-bold text-gray-900 dark:text-white/90">{user.name || 'User'}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">{user.email}</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Display Name
              </label>
              <input 
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1A1A1A] border border-black/5 dark:border-white/10 focus:border-[#C44536] outline-none transition text-sm text-black dark:text-white font-medium"
                value={user.name || ''}
                onChange={(e) => setUser({...user, name: e.target.value})}
              />
            </div>

            <button 
              disabled={isSaving || uploading}
              className="w-full bg-[#C44536] hover:bg-[#D85646] py-3.5 rounded-xl font-bold transition shadow-lg shadow-[#C44536]/10 disabled:opacity-50 text-xs uppercase tracking-widest text-white mt-2"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.dispatchEvent(new Event("storage"));
                router.push('/login');
              }}
              className="w-full py-3 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/5 transition border border-transparent hover:border-red-500/10"
            >
              Sign Out Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}