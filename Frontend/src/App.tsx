import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Home } from './components/Home';
import { PracticeConfig } from './components/PracticeConfig';
import { PlayerDashboard } from './components/PlayerDashboard';
import { usePracticeStore } from './hooks/usePracticeStore';

import { DEFAULT_PROJECT_ID } from './types';

/**
 * 應用程式的主要 View 狀態類型
 */
type ViewState = 'HOME' | 'SETUP' | 'PLAYER';

/**
 * 應用程式的主進入點元件
 * 負責處理簡易的 Hash 路由與全域配置
 */
function App() {
  // 透過 URL Hash 來判斷當前要顯示哪一個分頁，預設為 HOME
  const [view, setView] = useState<ViewState>(() => {
    const hash = window.location.hash.replace('#', '').toUpperCase();
    return (['HOME', 'SETUP', 'PLAYER'].includes(hash) ? hash : 'HOME') as ViewState;
  });

  // 管理當前選擇的專案 ID
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(() => {
    // 預設進入 SETUP 時，如果是從 HOME 點進來的，會由點擊事件設定
    // 這裡若是重新整理，暫時回歸 NULL (或可以從 hash 擴充)
    return null;
  });

  const { items } = usePracticeStore(currentProjectId);

  // 當 View 狀態改變時，同步更新 URL Hash
  useEffect(() => {
    window.location.hash = view.toLowerCase();
  }, [view]);

  // 監聽網址 Hash 變化並更新元件內部狀態
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toUpperCase() as ViewState;
      if (['HOME', 'SETUP', 'PLAYER'].includes(hash)) {
        setView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 處理進入訓練模式的安全檢查
  const handleStartPractice = () => {
    if (items.length === 0) {
      alert('請先設定訓練項目！');
      return;
    }
    setView('PLAYER');
  };

  return (
    <div className="min-h-screen bg-[#0b0f10] text-gray-100 font-sans selection:bg-[#13ec5b] selection:text-[#0b0f10]">
      <Toaster position="top-right" />
      
      {view === 'HOME' && (
        <Home 
          onCreateProject={() => {
            setCurrentProjectId(null);
            setView('SETUP');
          }} 
          onViewProjects={() => {
            setCurrentProjectId(DEFAULT_PROJECT_ID);
            setView('SETUP');
          }} 
        />
      )}
      
      {view === 'SETUP' && (
        <PracticeConfig 
          projectId={currentProjectId}
          onBack={() => setView('HOME')} 
          onStartPractice={handleStartPractice} 
        />
      )}
      
      {view === 'PLAYER' && (
        <PlayerDashboard 
          projectId={currentProjectId}
          onExit={() => setView('SETUP')} 
        />
      )}
    </div>
  );
}

export default App;
