import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Move, MoreHorizontal } from 'lucide-react';
import { CalendarDay, Post } from '../types';
import DayDetailsModal from './DayDetailsModal';

interface CalendarProps {
  currentDate: Date;
  onMonthChange: (increment: number) => void;
  posts: Post[];
  onDayClick: (date: Date) => void;
  onPostClick: (post: Post, e: React.MouseEvent) => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, onMonthChange, posts, onDayClick, onPostClick }) => {
  // Panning State
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Day Details Modal State
  const [detailsModalDate, setDetailsModalDate] = useState<Date | null>(null);

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const weekdays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  // --- Spacebar Panning & Month Switch Logic ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!e.repeat) setIsSpacePressed(true);
        if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
           e.preventDefault(); 
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSpacePressed && containerRef.current) {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: containerRef.current.scrollLeft,
        scrollTop: containerRef.current.scrollTop
      };
      e.preventDefault(); 
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      
      // Vertical Drag Month Switch Threshold
      if (Math.abs(dy) > 200) { 
          if (dy > 0) {
              onMonthChange(-1); 
          } else {
              onMonthChange(1); 
          }
          setIsDragging(false); 
          return;
      }

      containerRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
      containerRef.current.scrollTop = dragStart.current.scrollTop - dy;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // --- Calendar Logic ---

  const getDaysInMonth = (year: number, month: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];
    
    let startDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // Previous Month Days
    for (let i = startDayIndex; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false,
        isToday: false,
        isPast: true 
      });
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    // Current Month Days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const isToday = date.getDate() === today.getDate() && 
                      date.getMonth() === today.getMonth() && 
                      date.getFullYear() === today.getFullYear();
      
      days.push({
        date: date,
        isCurrentMonth: true,
        isToday: isToday,
        isPast: date.getTime() < today.getTime()
      });
    }

    // Next Month Days
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
        isPast: false
      });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const getPostsForDate = (date: Date) => {
    return posts.filter(p => 
      p.date.getDate() === date.getDate() && 
      p.date.getMonth() === date.getMonth() && 
      p.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white select-none relative">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 z-20 relative bg-white border-b border-slate-100">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {monthNames[currentDate.getMonth()]} <span className="text-slate-400 font-light">{currentDate.getFullYear()}</span>
          </h2>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
                <button onClick={() => onMonthChange(-1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all text-slate-500 hover:shadow-sm">
                    <ChevronLeft size={18} />
                </button>
                <button onClick={() => onMonthChange(1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all text-slate-500 hover:shadow-sm">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>

        {isSpacePressed && (
             <div className="animate-in fade-in flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-blue-600 text-white shadow-lg shadow-blue-200">
                <Move size={12} />
                <span>Pan & Switch</span>
            </div>
        )}
      </div>

      {/* Grid Content */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 overflow-auto p-8 flex flex-col relative ${isSpacePressed ? 'cursor-grab' : 'cursor-default'} ${isDragging ? '!cursor-grabbing' : ''}`}
      >
        
        {/* Weekday Header */}
        <div className="grid grid-cols-7 mb-2 min-w-[1000px]">
            {weekdays.map(day => (
                <div key={day} className="text-center pb-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                    {day}
                </div>
            ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 grid-rows-6 min-h-[900px] min-w-[1000px] flex-1 border-t border-l border-slate-200">
            {calendarDays.map((day, idx) => {
            const dayPosts = getPostsForDate(day.date);
            // Limit visible posts to 3
            const visiblePosts = dayPosts.slice(0, 3);
            const remainingCount = dayPosts.length - 3;
            
            // --- STYLING ---
            
            // Base Style
            let containerClass = "relative p-2 flex flex-col border-b border-r border-slate-200 transition-colors h-full min-h-[140px]";
            let numberClass = "text-[14px] font-medium w-8 h-8 flex items-center justify-center rounded-full mb-1";
            
            // Past Days Styling (Striped Pattern)
            const stripedPattern = {
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #f8fafc 10px, #f8fafc 20px)'
            };

            if (day.isPast && !day.isToday) {
               containerClass += " opacity-70"; 
            } else {
               containerClass += " bg-white hover:bg-slate-50";
            }

            if (!day.isCurrentMonth) {
                containerClass += " bg-slate-50/30 text-slate-300";
            }
            
            // Today Styling
            if (day.isToday) {
                numberClass += " bg-blue-600 text-white shadow-md shadow-blue-200";
            } else {
                numberClass += " text-slate-700";
                if (!day.isCurrentMonth) numberClass = numberClass.replace('text-slate-700', 'text-slate-300');
            }

            return (
                <div 
                key={idx}
                style={day.isPast && !day.isToday && day.isCurrentMonth ? stripedPattern : {}}
                onClick={() => !isSpacePressed && onDayClick(day.date)}
                className={`group ${containerClass}`}
                >
                <div className="flex justify-between items-start">
                    <span className={numberClass}>
                        {day.date.getDate()}
                    </span>
                    {day.isToday && <span className="text-[10px] font-bold text-blue-600 mt-2 mr-2">Bugün</span>}
                </div>

                {/* Posts Container - No Scrollbar */}
                <div className="flex flex-col gap-1.5 flex-1 mt-1">
                    {visiblePosts.map(post => (
                    <div 
                        key={post.id}
                        onClick={(e) => {
                            if(!isSpacePressed) onPostClick(post, e);
                        }}
                        className={`
                        py-1.5 px-2 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-2 border
                        ${post.status === 'draft' 
                            ? 'bg-slate-50 border-slate-200 text-slate-500' 
                            : 'bg-white border-slate-100 shadow-sm text-slate-700 hover:border-blue-300 hover:text-blue-600'}
                        `}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            post.platform === 'instagram' ? 'bg-pink-500' :
                            post.platform === 'linkedin' ? 'bg-blue-600' :
                            post.platform === 'twitter' ? 'bg-sky-500' : 'bg-red-500'
                        }`} />
                        <span className="truncate font-medium leading-tight">{post.title}</span>
                    </div>
                    ))}
                    
                    {/* Overflow Indicator */}
                    {remainingCount > 0 && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setDetailsModalDate(day.date);
                            }}
                            className="text-[10px] font-semibold text-slate-400 hover:text-blue-600 text-left px-1 mt-auto flex items-center gap-1"
                        >
                            <MoreHorizontal size={12} />
                            {remainingCount} tane daha...
                        </button>
                    )}
                </div>
                
                {/* Hover Add Button */}
                {(!day.isPast || day.isToday) && day.isCurrentMonth && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 z-10">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDayClick(day.date); }}
                            className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                )}
                </div>
            );
            })}
        </div>
      </div>

      {/* Modal for Day Details (Overflow) */}
      {detailsModalDate && (
        <DayDetailsModal 
            date={detailsModalDate}
            posts={getPostsForDate(detailsModalDate)}
            onClose={() => setDetailsModalDate(null)}
            onPostClick={(p) => {
                onPostClick(p, {} as any);
                setDetailsModalDate(null);
            }}
            onAddClick={() => {
                onDayClick(detailsModalDate);
                setDetailsModalDate(null);
            }}
        />
      )}
    </div>
  );
};

export default Calendar;