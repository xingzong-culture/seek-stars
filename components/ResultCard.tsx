import React, { useState } from 'react';
import { ConstellationData } from '../types';

interface ResultCardProps {
  data: ConstellationData;
}

const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-lg mx-auto perspective-1000 animate-fade-in px-4 pb-8">
      
      {/* Main Card Container - "Palace" Style */}
      <div className="relative bg-red-950 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] border-4 border-amber-600">
        
        {/* Gold Ornament Patterns (Corner Decor) */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent z-20"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent z-20"></div>

        {/* --- Header Section (Name) --- */}
        <div className="bg-[#450a0a] border-b-4 border-amber-600 p-4 text-center relative z-10">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <h3 className="text-amber-200 text-xs font-serif tracking-[0.6em] uppercase mb-1">{data.direction}</h3>
            <h1 className="text-4xl md:text-5xl font-calligraphy text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 drop-shadow-md py-1">
              {data.fullName}
            </h1>
        </div>

        {/* --- Image Section (The "Blind Box" Character) --- */}
        <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] overflow-hidden group border-b-4 border-amber-600">
          
          {/* Loading Placeholder */}
          {!imgLoaded && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-500/50 font-serif gap-2 animate-pulse">
                <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin"></div>
                <span>神兽唤醒中...</span>
             </div>
          )}
          
          {/* Main Image */}
          <img 
            src={data.imageUrl} 
            alt={data.fullName}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-1000 ease-out ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          />

          {/* Floating Element Badge */}
          <div className="absolute top-4 right-4 w-14 h-14">
             {/* Badge Body */}
             <div className="w-full h-full rounded-lg bg-red-900/90 border-2 border-amber-400 shadow-lg flex items-center justify-center rotate-3 transform hover:rotate-0 transition-transform">
                <span className="text-amber-100 font-calligraphy text-2xl drop-shadow-md">{data.element}</span>
             </div>
             {/* Badge Glow */}
             <div className="absolute -inset-2 bg-amber-500 rounded-lg blur-lg opacity-30 -z-10"></div>
          </div>

          {/* Bottom Gradient for Text */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-red-950/90 via-red-950/50 to-transparent pointer-events-none"></div>

          {/* Animal Name Tag */}
          <div className="absolute bottom-4 left-4 z-20">
             <div className="px-4 py-1 bg-amber-500 text-red-950 font-bold font-serif text-lg rounded-full shadow-lg border border-amber-200">
               {data.animal}神
             </div>
          </div>
        </div>

        {/* --- Content Body (Scroll) --- */}
        <div className="p-6 bg-[#2a0a0a] relative">
          
          {/* Poem */}
          <div className="mb-6 relative">
             <div className="absolute -left-2 top-0 bottom-0 w-1 bg-amber-700/50 rounded"></div>
             <p className="pl-4 text-amber-100/80 font-serif italic leading-relaxed">
               "{data.poem}"
             </p>
          </div>

          {/* Fortune Box */}
          <div className="bg-[#450a0a] rounded-xl p-4 border border-amber-800/50 relative">
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-900/50">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <h4 className="text-amber-400 font-bold text-sm tracking-widest">星宿启示</h4>
             </div>
             <p className="text-amber-100/90 font-serif text-sm leading-7 text-justify">
                {data.fortune}
             </p>
          </div>

        </div>
      </div>
      
      {/* Background Glows for the Card */}
      <div className="absolute top-10 left-10 right-10 bottom-10 bg-amber-500/10 blur-[80px] -z-10"></div>
    </div>
  );
};

export default ResultCard;