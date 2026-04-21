import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Loader2, Download, Eye } from 'lucide-react';

const ClientGallery = () => {
  const { id } = useParams<{ id: string }>();
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [gallery, setGallery] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGalleryInfo();
  }, [id]);

  const fetchGalleryInfo = async () => {
    setChecking(true);
    const { data, error } = await supabase
      .from('galleries')
      .select('*, images(*)')
      .eq('id', id)
      .single();

    if (error) {
      setError('Gallery not found or expired.');
    } else {
      setGallery(data);
      // Check if already authorized in session storage for this session
      if (sessionStorage.getItem(`gallery_${id}_auth`) === 'true') {
        setIsAuthorized(true);
      }
    }
    setChecking(false);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === gallery.pin) {
      setIsAuthorized(true);
      sessionStorage.setItem(`gallery_${id}_auth`, 'true');
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (error || !gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p className="text-gray-600">{error || 'Something went wrong.'}</p>
          <a href="/" className="mt-6 inline-block text-black underline">Back to Home</a>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-full mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">{gallery.name}</h2>
          <p className="text-gray-500 mb-8 text-sm">Please enter the 4-digit PIN provided to you to access this gallery.</p>
          
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              required
              placeholder="0 0 0 0"
              className="w-full text-center text-2xl tracking-[1em] border-2 border-gray-100 rounded-xl p-3 focus:border-black outline-none transition"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition"
            >
              Access Gallery
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="py-12 px-6 border-b text-center">
        <h1 className="text-4xl font-bold mb-2">{gallery.name}</h1>
        <p className="text-gray-500">Your curated moments are ready.</p>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        {gallery.images?.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No images have been uploaded to this gallery yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.images.map((img: any) => (
              <div key={img.id} className="relative aspect-[3/2] overflow-hidden group rounded-lg">
                <img src={img.url} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-4">
                  <a href={img.url} target="_blank" className="p-3 bg-white text-black rounded-full hover:bg-gray-100 shadow-lg">
                    <Eye size={20} />
                  </a>
                  <a href={img.url} download className="p-3 bg-white text-black rounded-full hover:bg-gray-100 shadow-lg" title="Download">
                    <Download size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-12 border-t text-center text-gray-400 text-sm">
        <p>© MPA Photography - Protected Gallery</p>
      </footer>
    </div>
  );
};

export default ClientGallery;
