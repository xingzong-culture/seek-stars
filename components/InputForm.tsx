import React, { useState, useEffect, useRef } from 'react';

interface InputFormProps {
  onSubmit: (date: string) => void;
}

// Generate number ranges
const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Current year
const currentYear = new Date().getFullYear();
const YEARS = range(1950, currentYear); // 1950 - Now
const MONTHS = range(1, 12);

const WheelPickerColumn = ({ 
  options, 
  value, 
  onChange, 
  label 
}: { 
  options: number[], 
  value: number, 
  onChange: (val: number) => void,
  label: string 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 48; // Slightly taller for better touch target

  // Initial scroll position
  useEffect(() => {
    if (containerRef.current) {
      const index = options.indexOf(value);
      if (index !== -1) {
        containerRef.current.scrollTop = index * itemHeight;
      }
    }
  }, []);

  const handleScrollEnd = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const index = Math.round(target.scrollTop / itemHeight);
    const validIndex = Math.max(0, Math.min(index, options.length - 1));
    onChange(options[validIndex]);
  };

  return (
    <div className="flex flex-col items-center relative h-60 w-1/3">
      {/* Scroll Container */}
      <div 
        ref={containerRef}
        onScroll={handleScrollEnd}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar text-center z-10"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="h-[96px]"></div> {/* Padding top (2 * itemHeight) */}
        {options.map((opt) => (
          <div 
            key={opt}
            onClick={() => {
              if (containerRef.current) {
                const idx = options.indexOf(opt);
                containerRef.current.scrollTo({ top: idx * itemHeight, behavior: 'smooth' });
                onChange(opt);
              }
            }}
            className={`
              h-[48px] flex items-center justify-center snap-center cursor-pointer transition-all duration-300 font-serif
              ${value === opt 
                ? 'text-white font-bold text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110' 
                : 'text-slate-500 text-lg scale-90 opacity-60'
              }
            `}
          >
            {opt} <span className={`text-xs ml-1 ${value === opt ? 'text-amber-200' : 'hidden'}`}>{label}</span>
          </div>
        ))}
        <div className="h-[96px]"></div> {/* Padding bottom */}
      </div>
    </div>
  );
};


const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  // Dynamic Days based on Year/Month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const maxDays = getDaysInMonth(year, month);
  const days = range(1, maxDays);

  // Fix day if out of range when month changes
  useEffect(() => {
    if (day > maxDays) setDay(maxDays);
  }, [month, year, maxDays, day]);

  const handleSubmit = () => {
    const yStr = year.toString();
    const mStr = month.toString().padStart(2, '0');
    const dStr = day.toString().padStart(2, '0');
    onSubmit(`${yStr}-${mStr}-${dStr}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[80vh] animate-fade-in relative overflow-hidden">
      
      {/* --- Background Decorations --- */}
      
      {/* 1. Starry Sky Overlay (Top) */}
      <div className="absolute top-0 left-0 right-0 h-1/2 opacity-40 pointer-events-none">
          <svg viewBox="0 0 400 200" className="w-full h-full stroke-blue-300 stroke-[0.5] fill-none">
             {/* Simple Constellation Lines */}
             <polyline points="50,50 80,30 120,60 150,40" />
             <circle cx="50" cy="50" r="1.5" className="fill-blue-200" />
             <circle cx="80" cy="30" r="1.5" className="fill-blue-200" />
             <circle cx="120" cy="60" r="1.5" className="fill-blue-200" />
             <circle cx="150" cy="40" r="1.5" className="fill-blue-200" />

             <polyline points="300,80 330,120 360,100" />
             <circle cx="300" cy="80" r="1.5" className="fill-blue-200" />
             <circle cx="330" cy="120" r="1.5" className="fill-blue-200" />
             <circle cx="360" cy="100" r="1.5" className="fill-blue-200" />
          </svg>
      </div>

      {/* 2. Mountain Landscape (Bottom) - Teal/Cyan tones */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-0">
          {/* Back Layer */}
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full text-teal-900 opacity-60 fill-current">
             <path d="M0,192L60,197.3C120,203,240,213,360,208C480,203,600,181,720,170.7C840,160,960,160,1080,181.3C1200,203,1320,245,1380,266.7L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
          {/* Front Layer */}
          <svg viewBox="0 0 1440 320" className="absolute bottom-[-10px] w-full h-3/4 text-teal-700 opacity-80 fill-current">
             <path d="M0,256L80,229.3C160,203,320,149,480,144C640,139,800,181,960,197.3C1120,213,1280,203,1360,197.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
      </div>


      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

        {/* Title */}
        <h2 className="text-white font-serif text-xl tracking-[0.2em] mb-12 drop-shadow-md">
          滑动输入您的出生日期
        </h2>

        {/* Wheel Picker Container */}
        <div className="w-full mb-16 relative">
          
          {/* Selection Lines (Golden Glow) */}
          <div className="absolute top-1/2 left-0 right-0 h-[48px] -mt-[24px] pointer-events-none z-0">
             {/* Top Line */}
             <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#fbbf24]">
                {/* Diamond Decor */}
                <div className="absolute left-1/2 -top-1 -ml-1 w-2 h-2 bg-amber-200 rotate-45 shadow-[0_0_5px_#fff]"></div>
             </div>
             {/* Bottom Line */}
             <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#fbbf24]">
                <div className="absolute left-1/2 -bottom-1 -ml-1 w-2 h-2 bg-amber-200 rotate-45 shadow-[0_0_5px_#fff]"></div>
             </div>
          </div>
          
          {/* Vertical Dividers */}
          <div className="absolute top-8 bottom-8 left-[33%] w-[1px] bg-white/10"></div>
          <div className="absolute top-8 bottom-8 right-[33%] w-[1px] bg-white/10"></div>

          {/* Columns */}
          <div className="flex justify-between items-center relative z-10 px-0">
             <WheelPickerColumn options={YEARS} value={year} onChange={setYear} label="年" />
             <WheelPickerColumn options={MONTHS} value={month} onChange={setMonth} label="月" />
             <WheelPickerColumn options={days} value={day} onChange={setDay} label="日" />
          </div>
        </div>

        {/* Button - Purple Style */}
        <button
          onClick={handleSubmit}
          className="
            relative group overflow-hidden w-48 py-3 rounded-full
            bg-gradient-to-b from-purple-700 to-purple-900
            border border-amber-400/80 shadow-[0_0_20px_rgba(147,51,234,0.4)]
            transition-all duration-300 active:scale-95 hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]
          "
        >
          {/* Inner Border/Glow */}
          <div className="absolute inset-[2px] rounded-full border border-white/20"></div>
          
          <span className="text-amber-100 font-serif text-lg tracking-[0.1em] drop-shadow-md">
            查看我的星宿
          </span>
        </button>

      </div>
    </div>
  );
};

export default InputForm;
