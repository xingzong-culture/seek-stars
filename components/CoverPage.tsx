import React from 'react';

interface CoverPageProps {
  onStart: () => void;
}

const CoverPage: React.FC<CoverPageProps> = ({ onStart }) => {
  // Updated Prompt to closely match the visual reference:
  // "Finding your guardian star", cute character looking up from a balcony/window, deep blue sky.
  const bgImage = "https://image.pollinations.ai/prompt/3D%20illustration%20vertical%20anime%20style%20cover%20art%2C%20cute%20ancient%20chinese%20boy%20wearing%20black%20and%20gold%20hanfu%20standing%20on%20a%20palace%20balcony%20looking%20up%20at%20starry%20night%20sky%2C%20reaching%20out%20hand%20to%20catch%20a%20glowing%20star%2C%20deep%20blue%20background%20with%20constellation%20lines%20and%20clouds%2C%20guochao%20style%2C%20pop%20mart%20character%20design%2C%20c4d%20render%2C%20dreamy?width=1080&height=1920&nologo=true&seed=999";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-900 text-white overflow-hidden animate-fade-in">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Cover Background" 
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-blue-950/80 pointer-events-none"></div>
      </div>

      {/* Main Title Area - Top Left */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <div className="absolute top-24 left-10 flex flex-row gap-4">
            
            {/* English Subtitle (Vertical) */}
            <div className="writing-vertical-rl text-[10px] tracking-[0.4em] text-blue-200 opacity-70 pt-2 h-[200px]">
                FIND YOUR STAR
            </div>

            {/* Main Title (Vertical Calligraphy) */}
            <h1 className="writing-vertical-rl font-calligraphy text-6xl md:text-7xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] leading-tight tracking-widest h-auto">
              <span className="text-white">寻找你的</span>
              <span className="mt-4 text-amber-200">守护星宿</span>
            </h1>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-20 pb-24 w-full flex flex-col items-center justify-end pointer-events-auto">
        
        {/* Start Button - Round Purple Style matching reference */}
        <button 
          onClick={onStart}
          className="relative group w-24 h-24 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          {/* Outer Glow Ring */}
          <div className="absolute -inset-3 rounded-full border border-purple-400/30 scale-90 group-hover:scale-100 transition-transform duration-500"></div>
          
          {/* Decorative Rhombus on sides (Reference style) */}
          <div className="absolute top-1/2 -left-8 w-2 h-2 bg-amber-300 rotate-45 shadow-[0_0_5px_#fcd34d]"></div>
          <div className="absolute top-1/2 -right-8 w-2 h-2 bg-amber-300 rotate-45 shadow-[0_0_5px_#fcd34d]"></div>
          {/* Connecting lines */}
          <div className="absolute top-1/2 -left-8 w-8 h-[1px] bg-purple-400/50 -z-10"></div>
          <div className="absolute top-1/2 right-0 w-8 h-[1px] bg-purple-400/50 -z-10"></div>

          {/* Main Button Body (Purple Gradient) */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-purple-500 to-purple-900 border-2 border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.8)] flex items-center justify-center relative overflow-hidden">
             
             {/* Shine */}
             <div className="absolute top-0 w-full h-1/2 bg-white/10 rounded-t-full pointer-events-none"></div>
             
             {/* Text */}
             <span className="text-white font-serif text-xl font-bold tracking-widest drop-shadow-md z-10">
               开始
             </span>
          </div>
        </button>
      </div>

    </div>
  );
};

export default CoverPage;