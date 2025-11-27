import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Instagram, Linkedin, Twitter, Youtube, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Post } from '../types';

interface BottomTimelineProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onAddClick: () => void;
}

const BottomTimeline: React.FC<BottomTimelineProps> = ({ posts, onPostClick, onAddClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Filter posts: Only today and future, sorted ascending
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const upcomingPosts = posts
    .filter(p => p.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 15); // Show next 15

  const groupedPosts = upcomingPosts.reduce((groups, post) => {
    const dateKey = post.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(post);
    return groups;
  }, {} as Record<string, Post[]>);

  const PlatformIcon = ({ p }: { p: string }) => {
      switch (p) {
        case 'instagram': return <Instagram size={14} className="text-pink-600" />;
        case 'linkedin': return <Linkedin size={14} className="text-blue-700" />;
        case 'twitter': return <Twitter size={14} className="text-sky-500" />;
        default: return <Youtube size={14} className="text-red-600" />;
      }
  };

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 ml-0 transition-all duration-500
      bg-white/90 backdrop-blur-xl border-t border-slate-200 z-40
      ${isOpen ? 'h-52' : 'h-10'}
    `} style={{ left: 'var(--sidebar-width, 80px)' }}> {/* Dynamic left based on sidebar if needed, but keeping fixed/fluid logic via parent usually better. Here simplified to fixed overlay or adjusted in layout. */}
      
      {/* Header / Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 flex items-center justify-between px-6 cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-100"
      >
        <div className="flex items-center gap-2 text-slate-500 font-medium text-xs uppercase tracking-wider">
          <Clock size={14} className="text-blue-600" />
          <span>Yayın Akışı</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] ml-1 font-bold">{upcomingPosts.length}</span>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Content */}
      <div className={`p-5 overflow-x-auto whitespace-nowrap h-42 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="flex gap-8 items-start h-full">
            
            {Object.entries(groupedPosts).map(([dateLabel, dayPosts], index) => {
                const posts = dayPosts as Post[];
                const isToday = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) === dateLabel;
                
                return (
                <div key={dateLabel} className="flex flex-col gap-3 flex-shrink-0">
                    {/* Date Header */}
                    <div className="flex items-center gap-2 px-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${isToday ? 'text-green-600' : 'text-slate-400'}`}>
                            {isToday ? 'BUGÜN' : dateLabel}
                        </span>
                    </div>

                    <div className="flex gap-3">
                         {posts.map(post => (
                             <div 
                                key={post.id}
                                onClick={() => onPostClick(post)}
                                className="w-56 bg-white border border-slate-200 rounded-2xl p-3 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all cursor-pointer group flex-shrink-0 relative"
                              >
                                <div className="flex items-start gap-3">
                                  {/* Thumbnail Preview */}
                                  <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 relative border border-slate-100">
                                     {post.mediaUrl ? (
                                        <img src={post.mediaUrl} alt="preview" className="w-full h-full object-cover" />
                                     ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <CalendarIcon size={16} />
                                        </div>
                                     )}
                                  </div>
                  
                                  <div className="flex-1 overflow-hidden whitespace-normal">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                                        {post.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' })}
                                      </span>
                                      <PlatformIcon p={post.platform} />
                                    </div>
                                    <h4 className="text-[11px] font-bold text-slate-700 truncate leading-tight">{post.title}</h4>
                                    <p className="text-[9px] text-slate-400 mt-0.5">
                                        {post.status === 'draft' ? 'Taslak' : 'Yayına Hazır'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                         ))}
                    </div>
                </div>
            )})}

          {/* Add Placeholder - Fixed Alignment */}
          <div className="flex-shrink-0 flex items-center h-[90px] mt-6"> 
             {/* Note: margin-top aligns it visually with the cards which are pushed down by date header */}
            <button 
                onClick={onAddClick}
                className="flex flex-col items-center justify-center w-20 h-20 border border-dashed border-slate-300 rounded-2xl text-slate-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
                <Plus size={24} />
                <span className="text-[9px] font-bold mt-1 uppercase">Yeni</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BottomTimeline;