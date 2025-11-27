import React, { useState } from 'react';
import { LayoutDashboard, Image, Hash, ChevronLeft, ChevronRight, PlusCircle, LucideIcon, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onComposeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onComposeClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showHashtagGen, setShowHashtagGen] = useState(false);
  const [hashtagKeyword, setHashtagKeyword] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const NavItem = ({ id, icon: Icon, label }: { id: string; icon: LucideIcon; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center w-full p-3 mb-1.5 rounded-xl transition-all duration-300 group relative ${
        activeTab === id 
          ? 'bg-black/5 text-slate-900 font-semibold' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={22} strokeWidth={2} className={`${activeTab === id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      {!isCollapsed && <span className="ml-3 text-[15px] tracking-tight">{label}</span>}
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
          {label}
        </div>
      )}
    </button>
  );

  const generateHashtags = async () => {
    if (!hashtagKeyword) return;
    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 10 popular and relevant hashtags for social media about: "${hashtagKeyword}". Return only the hashtags space separated.`,
        });
        if(response.text) setGeneratedHashtags(response.text);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative z-30`}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-md transition-all z-40"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Logo */}
      <div className={`flex items-center gap-3 p-6 mb-2 ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-10 h-10 relative flex-shrink-0">
          {/* Custom Cloud Logo Logic */}
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-600" stroke="currentColor" strokeWidth="0">
             <path fill="currentColor" d="M17.5,19c-0.3,0-0.5-0.1-0.7-0.2c-0.2-0.2-0.3-0.4-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7c0.2-0.2,0.4-0.3,0.7-0.3 c2.5,0,4.5-2,4.5-4.5c0-2.3-1.8-4.2-4-4.5c-0.4-0.1-0.7-0.4-0.7-0.8C17.2,4.1,14.8,2,12,2C8.6,2,5.8,4.3,5.1,7.5 C5,7.9,4.7,8.2,4.3,8.2C1.9,8.5,0,10.6,0,13c0,2.8,2.2,5,5,5c0.3,0,0.5,0.1,0.7,0.3s0.3,0.4,0.3,0.7c0,0.3-0.1,0.5-0.3,0.7 C5.5,19.9,5.3,20,5,20c-3.9,0-7-3.1-7-7c0-3.3,2.3-6.1,5.5-6.8C4.7,2.6,8.1,0,12,0c3.9,0,7.2,2.5,8.5,6.1c3.1,0.6,5.5,3.4,5.5,6.7 C26,16.4,22.2,20,17.5,19z"/>
             <path fill="currentColor" opacity="0.5" d="M12,6c-0.6,0-1,0.4-1,1v5.3l3.3,3.3c0.4,0.4,1,0.4,1.4,0s0.4-1,0-1.4L13,11.5V7C13,6.4,12.6,6,12,6z"/>
          </svg>
        </div>
        {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-300 overflow-hidden">
                <h1 className="font-bold text-lg text-slate-900 leading-none tracking-tight">@pdksbulut</h1>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">Sosyal Medya Yönetimi</span>
            </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 overflow-y-auto overflow-x-hidden">
        <NavItem id="dashboard" icon={LayoutDashboard} label="Genel Bakış" />
        <NavItem id="media" icon={Image} label="Medya Arşivi" />
        
        {/* Smart Tool Separator */}
        {!isCollapsed && <div className="mt-8 mb-4 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Araçlar</div>}
        
        <button
           onClick={() => setShowHashtagGen(!showHashtagGen)}
           className={`flex items-center w-full p-3 mb-1.5 rounded-xl transition-all group ${
                showHashtagGen ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
           }`}
        >
             <Hash size={22} className={`${showHashtagGen ? 'text-indigo-600' : 'text-slate-400'}`} />
             {!isCollapsed && <span className="ml-3 text-[15px]">Hashtag Studio</span>}
        </button>

        {/* Inline Hashtag Tool */}
        {!isCollapsed && showHashtagGen && (
            <div className="ml-2 mr-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-top-2">
                <input 
                    type="text" 
                    placeholder="Anahtar kelime..."
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none mb-2"
                    value={hashtagKeyword}
                    onChange={(e) => setHashtagKeyword(e.target.value)}
                />
                <button 
                    onClick={generateHashtags}
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 text-white text-xs py-1.5 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                    {isGenerating ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Sparkles size={12} />}
                    Üret
                </button>
                {generatedHashtags && (
                    <div className="mt-2 p-2 bg-white rounded border border-slate-100 text-[10px] text-slate-600 leading-relaxed">
                        {generatedHashtags}
                    </div>
                )}
            </div>
        )}

      </div>

      {/* Action Area */}
      <div className="p-4 mt-auto">
        <button 
          onClick={onComposeClick}
          className={`
            w-full bg-black text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-200
            flex items-center justify-center gap-2 rounded-2xl
            ${isCollapsed ? 'p-3 aspect-square' : 'py-3.5 px-4'}
          `}
        >
          <PlusCircle size={20} />
          {!isCollapsed && <span className="font-semibold text-sm">Hızlı Oluştur</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;