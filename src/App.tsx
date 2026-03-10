import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Play, Settings, Users, RefreshCw, Edit3, Mic } from 'lucide-react';

const defaultSpeakers = [
  "戴琦", "魏子彧", "赵祎聪", "侯欣瑶", "郭小楠", 
  "孔令宇", "沈方圆", "满运玖", "岳阳", "邓柳卿", 
  "邹心迪", "李恩慧", "刘欢滢", "陈天月", "王昊", 
  "曹钰", "刘愔"
];

export default function App() {
  const [page, setPage] = useState(0);
  const [speakers, setSpeakers] = useState<string[]>(defaultSpeakers);
  const [remaining, setRemaining] = useState<string[]>(defaultSpeakers);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [speakersInput, setSpeakersInput] = useState(defaultSpeakers.join('\n'));
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNextSpeaker = () => {
    if (remaining.length === 0) {
      setCurrentSpeaker("所有人已展示完毕！");
      return;
    }
    
    setIsAnimating(true);
    
    // Quick shuffle animation effect
    let shuffles = 0;
    const shuffleInterval = setInterval(() => {
      setCurrentSpeaker(remaining[Math.floor(Math.random() * remaining.length)]);
      shuffles++;
      if (shuffles > 10) {
        clearInterval(shuffleInterval);
        const randomIndex = Math.floor(Math.random() * remaining.length);
        const selected = remaining[randomIndex];
        setCurrentSpeaker(selected);
        setRemaining(prev => prev.filter((_, index) => index !== randomIndex));
        setIsAnimating(false);
      }
    }, 50);
  };

  const handleReset = () => {
    setRemaining(speakers);
    setCurrentSpeaker(null);
  };

  const handleSaveSettings = () => {
    const newList = speakersInput.split('\n').map(s => s.trim()).filter(s => s !== '');
    if (newList.length > 0) {
      setSpeakers(newList);
      setRemaining(newList);
      setCurrentSpeaker(null);
    }
    setShowSettings(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSettings) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (page === 0) setPage(1);
        else if (page === 1 && !isAnimating) handleNextSpeaker();
      } else if (e.key === 'ArrowLeft') {
        if (page === 1) setPage(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, remaining, showSettings, isAnimating]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative selection:bg-gray-300 selection:text-gray-800">
      {/* Navigation Controls */}
      <div className="absolute bottom-8 flex gap-8 z-40">
        <button 
          onClick={() => setPage(Math.max(0, page - 1))}
          className={`neu-button p-4 text-gray-500 ${page === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-label="Previous Page"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <button 
          onClick={() => setPage(Math.min(1, page + 1))}
          className={`neu-button p-4 text-gray-500 ${page === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-label="Next Page"
        >
          <ChevronRight size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Settings Button */}
      <AnimatePresence>
        {page === 1 && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setShowSettings(true)}
            className="absolute top-8 right-8 neu-button p-4 text-gray-500 z-40"
            aria-label="Settings"
          >
            <Settings size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl relative">
        <AnimatePresence mode="wait">
          {page === 0 && (
            <motion.div
              key="page0"
              initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
              className="neu-flat w-full aspect-[16/9] flex flex-col items-center justify-center p-8 md:p-16 text-center relative overflow-hidden"
            >
              <div className="absolute top-12 left-12 text-gray-400 opacity-50">
                <Mic size={48} strokeWidth={1.5} />
              </div>
              
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-10 tracking-tight text-gray-700 leading-tight" 
                style={{ textShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff' }}
              >
                Vibe Coding<br/>
                <span className="text-4xl md:text-6xl lg:text-7xl mt-4 block">分享会</span>
              </motion.h1>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="neu-pressed px-10 py-5 rounded-full"
              >
                <p className="text-xl md:text-3xl font-bold text-gray-500 tracking-widest uppercase">
                  每人2分钟时间展示
                </p>
              </motion.div>
            </motion.div>
          )}

          {page === 1 && (
            <motion.div
              key="page1"
              initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
              className="neu-flat w-full aspect-[16/9] flex flex-col items-center justify-center p-8 md:p-16 relative"
            >
              <div className="absolute top-8 left-8 flex items-center gap-4 text-gray-500 bg-[#E0E5EC] px-6 py-3 rounded-2xl" style={{ boxShadow: 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff' }}>
                <Users size={24} strokeWidth={2.5} />
                <span className="font-bold text-xl tracking-wider">剩余: {remaining.length} / {speakers.length}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-500 mb-12 tracking-widest uppercase">下一位演讲人</h2>
              
              <div className="neu-pressed w-full max-w-2xl h-48 md:h-64 flex items-center justify-center mb-16 rounded-[32px] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentSpeaker || 'empty'}
                    initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                    transition={{ duration: 0.3 }}
                    className={`text-6xl md:text-8xl font-extrabold text-center px-4 ${currentSpeaker === "所有人已展示完毕！" ? 'text-gray-400 text-4xl md:text-5xl' : 'text-gray-700'}`}
                    style={{ textShadow: currentSpeaker && currentSpeaker !== "所有人已展示完毕！" ? '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff' : 'none' }}
                  >
                    {currentSpeaker || '???'}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="flex gap-8">
                <button 
                  onClick={handleNextSpeaker}
                  disabled={isAnimating || remaining.length === 0}
                  className={`neu-button px-12 py-6 text-2xl font-bold text-gray-600 flex items-center gap-4 ${isAnimating || remaining.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Play size={28} strokeWidth={3} className={isAnimating ? 'animate-pulse' : ''} />
                  下一位
                </button>
                <button 
                  onClick={handleReset}
                  className="neu-button p-6 text-gray-500"
                  title="重置名单"
                >
                  <RefreshCw size={28} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#E0E5EC]/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="neu-flat w-full max-w-lg p-10 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4 text-gray-600">
                <Edit3 size={28} strokeWidth={2.5} />
                <h3 className="text-3xl font-extrabold tracking-wide">编辑名单</h3>
              </div>
              <p className="text-base text-gray-500 mb-8 font-medium leading-relaxed">
                每行输入一个名字。你可以直接从 <span className="font-bold text-gray-600">Google Sheet</span> 复制一列并粘贴到这里。
              </p>
              
              <textarea
                value={speakersInput}
                onChange={(e) => setSpeakersInput(e.target.value)}
                className="neu-input w-full h-72 p-6 text-gray-600 text-lg resize-none mb-10 font-bold leading-loose"
                placeholder="输入名字..."
              />
              
              <div className="flex justify-end gap-6">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="neu-button px-8 py-4 text-gray-500 font-bold text-lg"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveSettings}
                  className="neu-button px-8 py-4 text-gray-700 font-extrabold text-lg"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
