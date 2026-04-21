import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Trash2, Shield, Calendar, Image as ImageIcon } from 'lucide-react';

const GalleryManager = () => {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  const [newGallery, setNewGallery] = useState({ name: '', pin: Math.floor(1000 + Math.random() * 9000).toString(), expiry_date: '' });

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('galleries').select('*, images(*)');
    if (!error) setGalleries(data || []);
    setLoading(false);
  };

  const createGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('galleries').insert([{
      ...newGallery,
      user_id: user.id
    }]);

    if (!error) {
      setShowCreate(false);
      fetchGalleries();
    }
  };

  const deleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;
    const { error } = await supabase.from('galleries').delete().eq('id', id);
    if (!error) fetchGalleries();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
        <h2 className="text-lg font-semibold">Client Galleries</h2>
        <button 
          onClick={() => setShowCreate(true)}
          className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <Plus size={18} />
          <span>New Gallery</span>
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-xl font-bold mb-6">Create New Gallery</h3>
            <form onSubmit={createGallery} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client/Event Name</label>
                <input required className="w-full border rounded-lg p-2" value={newGallery.name} onChange={e => setNewGallery({...newGallery, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Access PIN</label>
                  <input required maxLength={4} className="w-full border rounded-lg p-2" value={newGallery.pin} onChange={e => setNewGallery({...newGallery, pin: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input type="date" className="w-full border rounded-lg p-2" value={newGallery.expiry_date} onChange={e => setNewGallery({...newGallery, expiry_date: e.target.value})} />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-black text-white rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white border rounded-xl p-6 transition hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{gallery.name}</h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                    <span className="flex items-center space-x-1"><Shield size={12} /> <span>{gallery.pin}</span></span>
                    <span className="flex items-center space-x-1"><Calendar size={12} /> <span>{gallery.expiry_date || 'No Expiry'}</span></span>
                    <span className="flex items-center space-x-1"><ImageIcon size={12} /> <span>{gallery.images?.length || 0} images</span></span>
                  </div>
                </div>
                <button onClick={() => deleteGallery(gallery.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
              </div>
              
              <button 
                onClick={() => alert('Image management for gallery coming next!')}
                className="w-full mt-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Manage Images
              </button>
            </div>
          ))}

          {galleries.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400">
              No galleries created yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
