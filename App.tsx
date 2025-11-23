import React, { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEY, UserRecord, ConstellationData } from './types';
import { calculateConstellation } from './utils/calculator';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import CoverPage from './components/CoverPage';
import WeComAuth from './components/WeComAuth';
import { getConstellationByIndex } from './services/constellationData';
import { saveToBackend } from './services/sheetService';

const App: React.FC = () => {
  const [record, setRecord] = useState<UserRecord | null>(null);
  const [displayData, setDisplayData] = useState<ConstellationData | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [started, setStarted] = useState(false); // State to track if user clicked "Start"
  const [wecomUser, setWeComUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: UserRecord = JSON.parse(stored);
        setRecord(parsed);
        setDisplayData(getConstellationByIndex(parsed.constellationId));
      } catch (e) {
        console.error("Storage parse error", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    setInitLoading(false);
  }, []);

  // Handle new submission
  const handleSubmission = (dateStr: string) => {
    // 1. Calculate (All logic is local)
    const constellation = calculateConstellation(dateStr);
    setDisplayData(constellation);

    // 2. Create Record Wrapper with WeCom info
    const newRecord: UserRecord = {
      birthDate: dateStr,
      constellationId: constellation.id,
      timestamp: Date.now(),
      ...(wecomUser && {
        wecomName: wecomUser.name,
        wecomDepartments: wecomUser.departmentNames,
        wecomPosition: wecomUser.position,
      })
    };

    // 3. Save to LocalStorage (simulating backend save for user persistence)
    setRecord(newRecord);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecord));

    // 4. Save to Real Backend (Feishu/Lark Base)
    // Fire and forget - we don't wait for this to finish to show the UI
    saveToBackend(newRecord, constellation.fullName);
  };

  // Handle WeCom authentication
  const handleWeComAuthSuccess = (userInfo: any) => {
    setWeComUser(userInfo);
    setAuthLoading(false);
    setAuthError(null);
  };

  const handleWeComAuthError = (error: string) => {
    setAuthError(error);
    setAuthLoading(false);
  };

  const handleStart = () => {
    setStarted(true);
  };

  if (initLoading) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-amber-500 font-serif">加载中...</div>;
  }

  // Check if WeCom authentication is explicitly enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isWeComEnabled = urlParams.has('wecom') && urlParams.get('wecom') === 'true';

  // Show WeCom authentication only if explicitly enabled
  if (isWeComEnabled && authLoading) {
    return (
      <WeComAuth 
        onAuthSuccess={handleWeComAuthSuccess}
        onAuthError={handleWeComAuthError}
      />
    );
  }

  // Show authentication error
  if (isWeComEnabled && authError) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
            <p className="text-red-400 text-sm font-serif mb-4">{authError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600/20 border border-amber-500/30 text-amber-200 px-6 py-2 rounded-full hover:bg-amber-600/30 transition-all duration-300 font-serif"
            >
              重新尝试
            </button>
            <button
              onClick={() => {
                // Remove wecom parameter and reload
                const url = new URL(window.location.href);
                url.searchParams.delete('wecom');
                window.location.href = url.toString();
              }}
              className="ml-3 bg-blue-600/20 border border-blue-500/30 text-blue-200 px-6 py-2 rounded-full hover:bg-blue-600/30 transition-all duration-300 font-serif"
            >
              标准访问
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reset auth states if WeCom is not enabled
  if (!isWeComEnabled) {
    setAuthLoading(false);
    setAuthError(null);
    setWeComUser(null);
  }

  // 1. Show Cover Page first
  if (!started) {
    return <CoverPage onStart={handleStart} />;
  }

  // 2. Main Application Loop
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden animate-fade-in bg-[#020617]">
      
      {/* Background Elements - Warm Winter Festival Theme */}
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2a0a0a] z-0 pointer-events-none"></div>
      
      {/* Floating Lights (Lanterns) */}
      <div className="absolute top-10 left-1/4 w-32 h-32 bg-amber-600/20 rounded-full blur-[60px]"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-600/20 rounded-full blur-[80px]"></div>
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>

      <main className="relative z-10 w-full flex flex-col items-center justify-center min-h-[80vh]">
        {/* WeCom user info display */}
        {wecomUser && (
          <div className="mb-6">
            <div className="inline-flex items-center space-x-3 bg-blue-950/30 backdrop-blur-md rounded-full px-6 py-3 border border-amber-500/20">
              <div className="w-8 h-8 bg-amber-500/30 rounded-full flex items-center justify-center">
                <span className="text-amber-200 text-sm font-serif">
                  {wecomUser.name?.charAt(0) || '用'}
                </span>
              </div>
              <div className="text-left">
                <p className="text-amber-200 text-sm font-serif">{wecomUser.name}</p>
                <p className="text-amber-500/60 text-xs">
                  {wecomUser.departmentNames?.join(' / ')} {wecomUser.position && `- ${wecomUser.position}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {!record ? (
          <InputForm onSubmit={handleSubmission} />
        ) : (
          displayData && (
            <div className="animate-fade-in w-full flex flex-col items-center">
              <ResultCard 
                data={displayData} 
              />
              <div className="mt-8 text-center pb-8">
                 <p className="text-amber-500/50 text-xs mb-3 font-serif tracking-widest">长按保存星宿卡片</p>
                 <button 
                    onClick={() => window.print()}
                    className="
                      text-amber-200 border border-amber-500/30 px-8 py-3 rounded-full 
                      bg-blue-950/50 backdrop-blur-md shadow-lg
                      hover:bg-amber-900/30 hover:border-amber-400
                      transition-all duration-300 cursor-pointer font-serif text-sm tracking-widest
                    "
                 >
                   保存纪念
                 </button>
              </div>
            </div>
          )
        )}
      </main>

      <footer className="fixed bottom-2 w-full text-center z-10 text-amber-500/20 text-[10px] font-serif pointer-events-none">
        &copy; {new Date().getFullYear()} Warm Winter Festival.
      </footer>
    </div>
  );
};

export default App;