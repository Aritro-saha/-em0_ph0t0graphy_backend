import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import { Trash2, Loader2, Plus } from 'lucide-react';

const PortfolioManager = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('wedding');

  useEffect(() => {
    fetchPortfolio();
  }, [category]);

  const fetchPortfolio = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_images')
      .select('*')
      .eq('category', category)
      .order('order', { ascending: true });

    if (error) console.error(error);
    else setImages(data || []);
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { url } = await uploadImage(file, 'portfolio', user.id, category);

      const { error } = await supabase
        .from('portfolio_images')
        .insert([{
          user_id: user.id,
          url,
          category,
          order: images.length
        }]);

      if (error) throw error;
      fetchPortfolio();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    const { error } = await supabase.from('portfolio_images').delete().eq('id', id);
    if (!error) setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        {['wedding', 'events', 'portraits', 'commercial'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
              category === cat ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Upload Button */}
        <label className="border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-black transition group">
          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          {uploading ? (
            <Loader2 className="animate-spin text-gray-400" />
          ) : (
            <>
              <Plus className="text-gray-400 group-hover:text-black mb-2" />
              <span className="text-xs text-gray-400 group-hover:text-black">Upload</span>
            </>
          )}
        </label>

        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-400 italic">Loading portfolio...</div>
        ) : (
          images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button 
                  onClick={() => deleteImage(img.id)}
                  className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
