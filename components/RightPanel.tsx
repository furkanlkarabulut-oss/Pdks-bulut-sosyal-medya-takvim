import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Instagram, Linkedin, Twitter, Youtube, CheckCircle2, Video, FileText, Image as ImageIcon, Trash2, Sparkles, Loader2, Type, Hash } from 'lucide-react';
import { Post, Platform, ContentType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedPost: Post | null;
  onSave: (post: Omit<Post, 'id'> | Post) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ isOpen, onClose, selectedDate, selectedPost, onSave }) => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [contentType, setContentType] = useState<ContentType>('post');
  const [notes, setNotes] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form açıldığında verileri doldur
  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title);
      setPlatform(selectedPost.platform);
      setContentType(selectedPost.type);
      setNotes(selectedPost.notes || '');
      setIsDraft(selectedPost.status === 'draft');
      setMediaUrl(selectedPost.mediaUrl);
    } else {
      setTitle('');
      setPlatform('instagram');
      setContentType('post');
      setNotes('');
      setIsDraft(false);
      setMediaUrl(undefined);
    }
  }, [selectedPost, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaUrl(undefined);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const generateAIContent = async () => {
    if (!title) {
        alert("Lütfen önce bir başlık girin.");
        return;
    }
    
    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Sen bir sosyal medya uzmanısın. Şu başlık için ${platform} platformuna uygun, ilgi çekici, emojili ve bol hashtag'li bir gönderi metni yaz: "${title}". Sadece metni ve hashtagleri ver.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (response.text) {
            setNotes(prev => (prev ? prev + "\n\n" + response.text : response.text));
        }
    } catch (error) {
        console.error("AI Generation failed", error);
        alert("İçerik oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
        setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate && !selectedPost) return;

    const postDate = selectedPost ? selectedPost.date : selectedDate!;

    const postData = {
      ...(selectedPost && { id: selectedPost.id }),
      title,
      platform,
      type: contentType,
      notes,
      date: postDate,
      status: isDraft ? 'draft' : 'scheduled' as const,
      mediaUrl: mediaUrl // Gerçek görsel verisi
    };

    onSave(postData);
    onClose();
  };

  const PlatformButton = ({ p, icon: Icon, label }: { p: Platform, icon: any, label: string }) => (
    <button
      type="button"
      onClick={() => setPlatform(p)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
        platform === p 
          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm transform scale-105' 
          : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50 text-slate-500'
      }`}
    >
      <Icon size={20} className="mb-1" />
      <span className="text-xs font-bold">{label}</span>
    </button>
  );

  return (
    <div className="w-[450px] bg-white border-l border-slate-200 h-screen overflow-y-auto shadow-2xl flex flex-col fixed right-0 top-0 z-40 animate-in slide-in-from-right duration-300 font-sans">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20 shadow-sm">
        <div>
            <h2 className="font-bold text-xl text-slate-900 tracking-tight">
            {selectedPost ? 'Gönderiyi Düzenle' : 'Yeni Planla'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
                {selectedPost 
                ? selectedPost.date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })
                : selectedDate?.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }) || 'Tarih seçilmedi'}
            </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={24} className="text-slate-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-8 bg-slate-50/50">
        
        {/* Title */}
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                <Type size={14} className="text-indigo-600" />
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Başlık / Konu</label>
            </div>
            <input 
                required
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Gönderi konusu nedir? (Örn: Haftalık İpuçları)"
                className="w-full p-4 text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none rounded-b-2xl bg-white"
            />
        </div>

        {/* Platform & Type Grid */}
        <div className="grid grid-cols-1 gap-6">
            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                    <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                    Hedef Platform
                </label>
                <div className="grid grid-cols-4 gap-3">
                    <PlatformButton p="instagram" icon={Instagram} label="Insta" />
                    <PlatformButton p="linkedin" icon={Linkedin} label="LinkedIn" />
                    <PlatformButton p="twitter" icon={Twitter} label="X" />
                    <PlatformButton p="youtube" icon={Youtube} label="YT" />
                </div>
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                    <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                    İçerik Formatı
                </label>
                <div className="flex gap-2 p-1 bg-slate-200 rounded-xl">
                    {['post', 'reel', 'story'].map((t) => (
                        <button
                        key={t}
                        type="button"
                        onClick={() => setContentType(t as ContentType)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all capitalize flex items-center justify-center gap-2 ${
                            contentType === t 
                            ? 'bg-white text-indigo-700 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                        >
                        {t === 'reel' ? <Video size={14} /> : t === 'story' ? <ImageIcon size={14} /> : <FileText size={14}/>}
                        {t === 'reel' ? 'Reels' : t === 'story' ? 'Story' : 'Gönderi'}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Media Upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
            <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
            Görsel / Video
          </label>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,video/*"
          />
          <div 
            onClick={() => !mediaUrl && fileInputRef.current?.click()}
            className={`
                relative w-full rounded-2xl transition-all cursor-pointer group overflow-hidden bg-white
                ${mediaUrl ? 'h-64 shadow-md' : 'h-32 border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30'}
            `}
          >
            {mediaUrl ? (
                <>
                    <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                        <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transform translate-y-2 group-hover:translate-y-0 transition-all"
                        >
                            Değiştir
                        </button>
                        <button 
                            type="button"
                            onClick={handleRemoveMedia}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transform translate-y-2 group-hover:translate-y-0 transition-all"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload size={20} className="text-slate-500" />
                    </div>
                    <span className="text-xs font-semibold">Medya Yükle</span>
                </div>
            )}
          </div>
        </div>

        {/* Notes with AI Generation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-indigo-600" />
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Açıklama</label>
              </div>
              <button 
                type="button"
                onClick={generateAIContent}
                disabled={isGenerating}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 px-3 py-1.5 rounded-full shadow-sm transition-all disabled:opacity-50 transform hover:scale-105"
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {isGenerating ? 'Yazılıyor...' : 'Sihirli Oluştur'}
              </button>
            </div>
          
            <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                className="w-full p-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none leading-relaxed bg-white"
                placeholder="Gönderi metnini buraya yazın..."
            />
            
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-end">
                 <span className={`text-xs font-medium ${notes.length > 280 ? 'text-red-500' : 'text-slate-400'}`}>
                    {notes.length} karakter
                 </span>
            </div>
        </div>
      </form>

      <div className="p-6 border-t border-slate-200 bg-white sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleSubmit}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
        >
          <CheckCircle2 size={22} />
          {selectedPost ? 'Güncelle' : 'Kaydet & Planla'}
        </button>
        <button 
           type="button"
           onClick={() => { setIsDraft(true); handleSubmit({preventDefault: () => {}} as React.FormEvent); }}
           className="w-full mt-3 text-slate-500 hover:text-indigo-600 font-semibold text-sm py-2 transition-colors"
        >
          Taslak Olarak Kaydet
        </button>
      </div>
    </div>
  );
};

export default RightPanel;