import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Image as ImageIcon, 
  Layout, 
  Mail, 
  Settings, 
  LogOut, 
  Plus,
  FolderOpen
} from 'lucide-react';
import PortfolioManager from '../components/PortfolioManager';
import GalleryManager from '../components/GalleryManager';
import MessageManager from '../components/MessageManager';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
        activeTab === id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="text-xl font-bold mb-10 flex items-center space-x-2">
          <span>Admin Panel</span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem id="portfolio" icon={ImageIcon} label="Portfolio" />
          <SidebarItem id="galleries" icon={FolderOpen} label="Client Galleries" />
          <SidebarItem id="messages" icon={Mail} label="Messages" />
          <SidebarItem id="content" icon={Layout} label="Content Manager" />
          <SidebarItem id="settings" icon={Settings} label="Settings" />
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
          <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            <Plus size={18} />
            <span>Add New</span>
          </button>
        </header>

        {/* Content Area Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
          {activeTab === 'portfolio' && <PortfolioManager />}
          {activeTab === 'galleries' && <GalleryManager />}
          {activeTab === 'messages' && <MessageManager />}
          
          {/* We will implement other sections in the following steps */}
          {activeTab !== 'portfolio' && activeTab !== 'galleries' && activeTab !== 'messages' && (
            <p className="text-gray-500">Section {activeTab} is coming soon...</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
