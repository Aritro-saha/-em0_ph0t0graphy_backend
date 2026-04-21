import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, CheckCircle, Trash2, Loader2, MapPin, Tag } from 'lucide-react';

const MessageManager = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setMessages(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      setMessages(messages.map(msg => msg.id === id ? { ...msg, is_read: !currentStatus } : msg));
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (!error) setMessages(messages.filter(msg => msg.id !== id));
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <tr key={msg.id} className={`${msg.is_read ? 'bg-white' : 'bg-blue-50/30'}`}>
                <td className="px-6 py-4">
                  <button onClick={() => markAsRead(msg.id, msg.is_read)}>
                    {msg.is_read ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <Mail size={20} className="text-blue-500" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{msg.name}</div>
                  <div className="text-sm text-gray-500">{msg.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Tag size={14} className="text-gray-400" />
                    <span>{msg.service}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{msg.location}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 italic">"{msg.message}"</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(msg.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteMessage(msg.id)} className="text-red-400 hover:text-red-600 transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-400">No messages yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessageManager;
