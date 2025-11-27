import React, { useState } from 'react';
import Calendar from './components/Calendar';
import RightPanel from './components/RightPanel';
import BottomTimeline from './components/BottomTimeline';
import PostDetailModal from './components/PostDetailModal';
import { Post } from './types';
import { ImageIcon, Calendar as CalendarIcon, Plus } from 'lucide-react';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'Ürün Lansmanı Teaser',
    date: new Date(), 
    platform: 'instagram',
    type: 'reel',
    status: 'scheduled',
    notes: 'Yeni sezon ürünlerimizin ilk tanıtımı. #yeniurun #lansman',
    mediaUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Haftalık Blog Özeti',
    date: new Date(new Date().setDate(new Date().getDate() + 2)), 
    platform: 'linkedin',
    type: 'post',
    status: 'draft',
    notes: 'Şirket kültürü hakkında yazı paylaşımı.',
    mediaUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop'
  }
];

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  
  // View State (Replaces Sidebar Tab)
  const [activeView, setActiveView] = useState<'calendar' | 'media'>('calendar');
  
  // States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewPost, setViewPost] = useState<Post | null>(null);

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedPost(null);
    setIsEditorOpen(true);
  };

  const handlePostClick = (post: Post, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setViewPost(post);
  };

  const handleEditFromModal = () => {
    if (viewPost) {
        setSelectedPost(viewPost);
        setSelectedDate(viewPost.date);
        setViewPost(null); // Close modal
        setIsEditorOpen(true); // Open editor
    }
  };

  const handleSavePost = (postData: Omit<Post, 'id'> | Post) => {
    if ('id' in postData) {
      setPosts(posts.map(p => p.id === postData.id ? postData as Post : p));
    } else {
      const newPost: Post = {
        ...postData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setPosts([...posts, newPost]);
    }
  };

  const handleComposeClick = () => {
    setSelectedDate(new Date());
    setSelectedPost(null);
    setIsEditorOpen(true);
  };

  // Media Library View Component
  const MediaLibraryView = () => (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/50 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><ImageIcon size={20} /></div>
            Medya Arşivi
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {posts.filter(p => p.mediaUrl).map(post => (
          <div key={post.id} onClick={() => handlePostClick(post)} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer bg-white border border-slate-100">
            <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
               <span className="text-white text-[10px] font-bold truncate">{post.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-white text-slate-900 font-sans overflow-hidden">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-30 sticky top-0">
         {/* Logo Area */}
         <div className="flex items-center gap-2">
             <div className="w-8 h-8 text-blue-600">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="0">
                     <path fill="currentColor" d="M17.5,19c-0.3,0-0.5-0.1-0.7-0.2c-0.2-0.2-0.3-0.4-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7c0.2-0.2,0.4-0.3,0.7-0.3 c2.5,0,4.5-2,4.5-4.5c0-2.3-1.8-4.2-4-4.5c-0.4-0.1-0.7-0.4-0.7-0.8C17.2,4.1,14.8,2,12,2C8.6,2,5.8,4.3,5.1,7.5 C5,7.9,4.7,8.2,4.3,8.2C1.9,8.5,0,10.6,0,13c0,2.8,2.2,5,5,5c0.3,0,0.5,0.1,0.7,0.3s0.3,0.4,0.3,0.7c0,0.3-0.1,0.5-0.3,0.7 C5.5,19.9,5.3,20,5,20c-3.9,0-7-3.1-7-7c0-3.3,2.3-6.1,5.5-6.8C4.7,2.6,8.1,0,12,0c3.9,0,7.2,2.5,8.5,6.1c3.1,0.6,5.5,3.4,5.5,6.7 C26,16.4,22.2,20,17.5,19z"/>
                </svg>
             </div>
             <span className="font-bold text-lg tracking-tight">@pdksbulut</span>
         </div>

         {/* Center Toggle */}
         <div className="absolute left-1/2 transform -translate-x-1/2 bg-slate-100 p-1 rounded-full flex items-center gap-1">
             <button 
                onClick={() => setActiveView('calendar')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all ${activeView === 'calendar' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <CalendarIcon size={14} />
                Takvim
             </button>
             <button 
                onClick={() => setActiveView('media')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all ${activeView === 'media' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <ImageIcon size={14} />
                Medya Arşivi
             </button>
         </div>

         {/* Right Action */}
         <div>
             <button 
                onClick={handleComposeClick}
                className="bg-black text-white hover:bg-slate-800 transition-colors px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-slate-200"
             >
                 <Plus size={16} />
                 Planla
             </button>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {activeView === 'calendar' ? (
             <div className="h-full pb-60"> {/* Padding bottom for timeline */}
                <Calendar 
                    currentDate={currentDate}
                    onMonthChange={handleMonthChange}
                    posts={posts}
                    onDayClick={handleDayClick}
                    onPostClick={handlePostClick}
                />
             </div>
          ) : (
             <MediaLibraryView />
          )}
        </div>

        {/* Bottom Timeline - Only show in Calendar View */}
        {activeView === 'calendar' && (
          <BottomTimeline 
            posts={posts} 
            onPostClick={(p) => handlePostClick(p)} 
            onAddClick={handleComposeClick}
          />
        )}
      </main>

      {/* Modals */}
      {viewPost && (
        <PostDetailModal 
            post={viewPost} 
            onClose={() => setViewPost(null)} 
            onEdit={handleEditFromModal} 
        />
      )}

      <RightPanel 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)}
        selectedDate={selectedDate}
        selectedPost={selectedPost}
        onSave={handleSavePost}
      />
    </div>
  );
};

export default App;