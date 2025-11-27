import React from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Post } from '../types';

interface DayDetailsModalProps {
  date: Date;
  posts: Post[];
  onClose: () => void;
  onPostClick: (post: Post) => void;
  onAddClick: () => void;
}

const DayDetailsModal: React.FC<DayDetailsModalProps> = ({ date, posts, onClose, onPostClick, onAddClick }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden animate-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div>
               <h3 className="font-bold text-slate-900">
                   {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
               </h3>
               <span className="text-xs text-slate-500 font-medium">{date.toLocaleDateString('tr-TR', { weekday: 'long' })}</span>
           </div>
           <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500">
               <X size={18} />
           </button>
        </div>

        <div className="p-2 max-h-[400px] overflow-y-auto">
            {posts.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    <p className="text-sm">Bu gün için plan yok.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {posts.map(post => (
                        <button 
                            key={post.id}
                            onClick={() => onPostClick(post)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group"
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                post.platform === 'instagram' ? 'bg-pink-50 text-pink-600' :
                                post.platform === 'linkedin' ? 'bg-blue-50 text-blue-600' :
                                post.platform === 'twitter' ? 'bg-sky-50 text-sky-600' :
                                'bg-red-50 text-red-600'
                            }`}>
                                <CalendarIcon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-slate-900 truncate">{post.title}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 rounded">{post.platform}</span>
                                    <span className="text-[10px] text-slate-400">{post.type}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        <div className="p-3 border-t border-slate-100 bg-slate-50/30">
            <button 
                onClick={onAddClick}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
            >
                Yeni Plan Ekle
            </button>
        </div>
      </div>
    </div>
  );
};

export default DayDetailsModal;