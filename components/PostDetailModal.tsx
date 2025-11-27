import React from 'react';
import { X, Edit2, Calendar, Share2, Copy, Hash } from 'lucide-react';
import { Post } from '../types';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  onEdit: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Header - Minimal */}
        <div className="flex items-center justify-between p-5 border-b border-slate-50 bg-slate-50/50">
           <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                     post.platform === 'instagram' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                     post.platform === 'linkedin' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                     post.platform === 'twitter' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                     'bg-red-50 text-red-600 border-red-100'
                 }`}>
                    {post.platform}
                 </span>
                 <span className="text-[10px] font-semibold text-slate-400 uppercase bg-white border border-slate-200 px-2 py-1 rounded-md">
                    {post.type}
                 </span>
           </div>
           
           <button 
            onClick={onClose}
            className="w-8 h-8 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">{post.title}</h2>
          
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-6">
            <Calendar size={14} className="text-slate-400" />
            <span>{post.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>{post.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' })}</span>
          </div>
          
          <div className="space-y-4">
              <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Edit2 size={10} />
                    Açıklama / Metin
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100 min-h-[80px]">
                    {post.notes || "Açıklama girilmemiş."}
                  </div>
              </div>
          </div>

          <div className="mt-6 flex gap-3 pt-4 border-t border-slate-50">
             <button 
                onClick={onEdit}
                className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
             >
                <Edit2 size={14} />
                Düzenle
             </button>
             <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
                <Copy size={16} />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostDetailModal;