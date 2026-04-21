import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGalleryImages } from '../features/galleries/hooks';
import { validatePin } from '../features/galleries/api';
import { Loader2, Lock } from 'lucide-react';

interface GalleryProps {
  openLightbox: (index: number, images: string[]) => void;
}

const Gallery: React.FC<GalleryProps> = ({ openLightbox }) => {
  const { id } = useParams<{ id: string }>();
  const { data: images, isLoading } = useGalleryImages(id);
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    const isValid = await validatePin(id, pin);
    if (isValid) {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Invalid PIN. Please try again.');
    }
  };

  if (isLoading) return <div className="page active flex justify-center py-20"><Loader2 className="animate-spin text-gold" /></div>;

  if (!id) return <div className="page active p-20 text-center text-cream"><h2>Gallery not found</h2></div>;

  if (!isAuthorized) {
    return (
      <div className="page active flex items-center justify-center p-20">
        <div className="bg-white/5 p-12 rounded-2xl border border-white/10 max-w-md w-full text-center">
          <Lock className="mx-auto mb-6 text-gold" size={48} />
          <h2 className="text-2xl font-serif mb-4 text-cream">Protected Gallery</h2>
          <p className="text-gray-400 mb-8">Please enter the access PIN provided by your photographer.</p>
          <form onSubmit={handlePinSubmit}>
            <input 
              type="password" 
              placeholder="Enter PIN" 
              className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 mb-4 text-center text-xl tracking-widest focus:border-gold outline-none text-cream"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button className="btn-gold w-full py-4">Unlock Gallery</button>
          </form>
        </div>
      </div>
    );
  }

  const imageUrls = images.map(img => img.url);

  return (
    <div className="page active" id="page-gallery">
      <div className="gallery-masonry" id="gallery-grid" style={{ paddingTop: '100px' }}>
        {imageUrls.map((src, i) => (
          <div key={i} className="gallery-item" onClick={() => openLightbox(i, imageUrls)}>
            <img src={src} alt="Gallery item" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
