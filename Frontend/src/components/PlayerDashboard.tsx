import React, { useState, useEffect, useRef } from 'react';
import { type YouTubeProps } from 'react-youtube';
import type { TimerState } from '../types';
import { usePracticeStore } from '../hooks/usePracticeStore';
import { useTTS } from '../hooks/useTTS';
import { Pause, Play, Square, SkipForward, Maximize2 } from 'lucide-react';
import { YouTubeController } from './Player/YouTubeController';
import { TimerDisplay } from './Player/TimerDisplay';
import { TimelineItem } from './Player/TimelineItem';

interface PlayerDashboardProps {
    onExit: () => void;
}

const PREPARE_SECONDS = 3;

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [period, setPeriod] = useState<TimerState>('PREPARING');
    const [timeLeft, setTimeLeft] = useState(PREPARE_SECONDS);
    const [isPaused, setIsPaused] = useState(false);
    const [restStartTime, setRestStartTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const restVideoRandomizedRef = useRef(false);

    const { items, restVideoUrl } = usePracticeStore();
    const { speak, cancel } = useTTS();

    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const extractVideoId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : undefined;
    };

    const currentItem = items[currentIndex];
    const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

    let activeVideoUrl = '';
    if ((period === 'PRACTICING' || period === 'PREPARING') && currentItem?.youtubeUrl) {
        activeVideoUrl = currentItem.youtubeUrl;
    } else if (period === 'RESTING' && restVideoUrl) {
        activeVideoUrl = restVideoUrl;
    }

    const activeVideoId = extractVideoId(activeVideoUrl) || null;

    // TTS 播報邏輯 (保持原樣，因為它是業務邏輯)
    useEffect(() => {
        if (period === 'FINISHED') {
            speak('訓練完成，太棒了！');
            return;
        }

        if (period === 'PREPARING') {
            speak(`準備開始，接下來是：${currentItem.stageName}`);
        } else if (period === 'PRACTICING' && timeLeft === 3) {
            if (nextItem) {
                speak(`休息一下。下一個動作是：${nextItem.stageName}`);
            } else {
                speak('快結束了，堅持下去！');
            }
        } else if (period === 'PRACTICING' && timeLeft === currentItem.practiceSeconds) {
            speak('開始');
        } else if (period === 'RESTING' && timeLeft === 3) {
            const nextIdx = items.findIndex(i => i.id === currentItem.id) + 1;
            const next = items[nextIdx];
            if (next) {
                speak(`準備開始，接下來是：${next.stageName}`);
            }
        }

        if ((period === 'PRACTICING' || period === 'RESTING') && timeLeft === 3 && !isPaused) {
            speak('三');
        } else if ((period === 'PRACTICING' || period === 'RESTING') && timeLeft === 2 && !isPaused) {
            speak('二');
        } else if ((period === 'PRACTICING' || period === 'RESTING') && timeLeft === 1 && !isPaused) {
            speak('一');
        }
    }, [period, currentItem?.stageName, nextItem?.stageName, timeLeft, isPaused, speak, items, currentItem?.id, currentItem?.practiceSeconds]);

    useEffect(() => {
        if (isPaused || period === 'FINISHED') return;
        const timerCount = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerCount);
    }, [isPaused, period]);

    useEffect(() => {
        if (timeLeft > 0) return;
        if (period === 'PREPARING') {
            setPeriod('PRACTICING');
            setTimeLeft(currentItem.practiceSeconds);
        } else if (period === 'PRACTICING') {
            if (currentItem.restSeconds > 0) {
                setRestStartTime(Math.floor(Math.random() * 300));
                restVideoRandomizedRef.current = false;
                setPeriod('RESTING');
                setTimeLeft(currentItem.restSeconds);
            } else {
                handleNextItem();
            }
        } else if (period === 'RESTING') {
            handleNextItem();
        }
    }, [timeLeft, period, currentItem]);

    // 影片狀態輪詢邏輯
    useEffect(() => {
        if (!playerRef.current || isPaused) return;

        const checkInterval = setInterval(async () => {
            if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function' && typeof playerRef.current.getPlayerState === 'function') {
                try {
                    const state = playerRef.current.getPlayerState();
                    const currentTime = await playerRef.current.getCurrentTime();

                    if (period === 'PRACTICING') {
                        const startSec = currentItem.startSecond ?? 0;
                        if (currentItem.endSecond && currentTime >= currentItem.endSecond) {
                            playerRef.current.seekTo(startSec, true);
                        } else if (state === 0) { 
                            playerRef.current.seekTo(startSec, true);
                            playerRef.current.playVideo();
                        } else if (state !== 1 && state !== 3) {
                            playerRef.current.playVideo();
                        }
                    } else if (period === 'PREPARING') {
                        if (state === 1) { 
                            const startSec = currentItem?.startSecond ?? 0;
                            playerRef.current.pauseVideo();
                            playerRef.current.seekTo(startSec, true);
                        }
                    } else if (period === 'RESTING') {
                        if (state === 1 && !restVideoRandomizedRef.current) {
                            const duration = await playerRef.current.getDuration();
                            if (duration > 60) {
                                const randomStart = Math.floor(Math.random() * (duration - 30));
                                playerRef.current.seekTo(randomStart, true);
                            }
                            restVideoRandomizedRef.current = true;
                        } else if (state === 0) { 
                            playerRef.current.playVideo();
                        }
                    }
                } catch (e) { console.error("YT Error", e); }
            }
        }, 500);
        return () => clearInterval(checkInterval);
    }, [period, currentItem, isPaused]);

    useEffect(() => {
        if (playerRef.current && typeof playerRef.current.pauseVideo === 'function' && typeof playerRef.current.playVideo === 'function') {
            if (isPaused) { playerRef.current.pauseVideo(); } 
            else { playerRef.current.playVideo(); }
        }
    }, [isPaused]);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
        const startSec = period === 'RESTING' ? restStartTime : (currentItem?.startSecond ?? 0);
        event.target.loadVideoById({ videoId: activeVideoId, startSeconds: startSec });
        if (period === 'PRACTICING' || period === 'RESTING') {
            event.target.playVideo();
        } else {
            event.target.pauseVideo();
        }
    };

    useEffect(() => {
        if (playerRef.current && activeVideoId && typeof playerRef.current.loadVideoById === 'function') {
            const startSec = period === 'RESTING' ? restStartTime : (currentItem?.startSecond ?? 0);
            if (period === 'PRACTICING' || period === 'RESTING' || period === 'PREPARING') {
                try {
                    playerRef.current.loadVideoById({ videoId: activeVideoId, startSeconds: startSec });
                    if (period === 'PREPARING') {
                        setTimeout(() => {
                            if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
                                playerRef.current.pauseVideo();
                            }
                        }, 500);
                    }
                } catch (e) { console.error("YT Player Error:", e); }
            }
        }
    }, [activeVideoId, period, currentItem?.startSecond, restStartTime]);

    const handleNextItem = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setPeriod('PREPARING');
            setTimeLeft(PREPARE_SECONDS);
        } else {
            setPeriod('FINISHED');
        }
    };

    const handleJumpToStage = (idx: number) => {
        setCurrentIndex(idx);
        setPeriod('PREPARING');
        setTimeLeft(PREPARE_SECONDS);
        setIsPaused(false);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => console.error(err));
        } else { document.exitFullscreen(); }
    };

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleExit = () => {
        cancel();
        if (document.fullscreenElement) document.exitFullscreen();
        onExit();
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getStatusText = () => {
        switch (period) {
            case 'PREPARING': return 'PREPARING';
            case 'PRACTICING': return 'TRAINING';
            case 'RESTING': return 'RESTING';
            default: return '';
        }
    };

    if (period === 'FINISHED') {
        return (
            <div className="min-h-screen bg-[#0b0f10] text-[#eef6f0] flex flex-col items-center justify-center p-6 text-center z-50 absolute inset-0">
                <div className="size-24 bg-[#13ec5b]/20 text-[#13ec5b] rounded-full flex items-center justify-center mb-6 border-4 border-[#13ec5b]">
                    <span className="material-symbols-outlined text-[48px]">emoji_events</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-4 text-[#13ec5b]">TRAINING COMPLETED</h2>
                <p className="text-slate-400 text-lg mb-10 max-w-md">Excellent work! You've successfully finished your training plan.</p>
                <button onClick={handleExit} className="bg-[#13ec5b] text-[#112116] px-8 py-3 rounded-xl font-bold hover:bg-[#13ec5b]/90 transition-colors shadow-[0_0_20px_rgba(19,236,91,0.2)]">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const totalPeriodSeconds = period === 'PREPARING' ? PREPARE_SECONDS : (period === 'PRACTICING' ? currentItem.practiceSeconds : currentItem.restSeconds);
    const progressPercent = Math.max(0, Math.min(100, ((totalPeriodSeconds - timeLeft) / totalPeriodSeconds) * 100));

    return (
        <div ref={containerRef} className="bg-[#0b0f10] text-[#eef6f0] font-sans min-h-screen flex flex-col overflow-hidden relative w-full absolute inset-0 z-50">
            <header className="flex justify-between items-center px-4 py-3 md:px-8 border-b border-white/5 relative z-20 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={handleExit} className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white" title="Exit Training">
                        <Square size={18} fill="currentColor" />
                    </button>
                    <div className="h-6 w-px bg-white/10 mx-1 md:mx-2"></div>
                    <div>
                        <h2 className="text-white font-bold text-sm md:text-base leading-tight truncate max-w-[150px] md:max-w-xs">{currentItem.stageName}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="size-2 rounded-full bg-[#13ec5b] animate-pulse"></span>
                            <span className="text-[#13ec5b] text-[10px] md:text-xs font-bold tracking-wider uppercase">{getStatusText()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setTimeLeft(0)} className="flex hover:text-[#13ec5b] transition-colors items-center gap-1 text-xs md:text-sm font-medium border border-white/10 px-3 py-1.5 rounded bg-white/5">
                        <SkipForward size={16} /> <span className="hidden md:inline">Skip</span>
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-full transition-colors group" title="Fullscreen">
                        <Maximize2 size={20} className="text-slate-400 group-hover:text-white" />
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden bg-black">
                <div className="flex-1 flex flex-col relative z-10 justify-center">
                    <TimerDisplay timeLeft={timeLeft} statusText={getStatusText()} formatTime={formatTime} />

                    <YouTubeController 
                        videoId={activeVideoId} 
                        onReady={onPlayerReady} 
                        isFullscreen={isFullscreen} 
                        ref={playerRef} 
                    />

                    {isFullscreen && (
                        <div className="absolute bottom-12 right-8 z-30 pointer-events-none flex flex-col items-end animate-fade-in-up">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 shadow-2xl flex flex-col items-end">
                                <span className="text-slate-400 text-[10px] font-bold tracking-[0.2em] mb-0.5 uppercase">Next Up</span>
                                <span className="text-white text-base md:text-lg font-bold tracking-tight">
                                    {period === 'PREPARING' ? currentItem.stageName : (period === 'PRACTICING' && currentItem.restSeconds > 0 ? 'Rest' : (nextItem ? nextItem.stageName : 'Finish'))}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`w-full lg:w-80 xl:w-96 bg-[#112116] border-t lg:border-t-0 lg:border-l border-[#244730] flex flex-col z-20 transition-all ${isFullscreen ? 'hidden' : ''}`}>
                    <div className="p-4 md:p-6 border-b border-[#244730] flex justify-between items-end bg-[#15291b]">
                        <div>
                            <h3 className="text-white font-bold text-lg md:text-xl mb-1">Workout Timeline</h3>
                            <p className="text-[#13ec5b] text-xs font-medium uppercase tracking-wider">Stage {currentIndex + 1} of {items.length}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 relative">
                        <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-[#244730] z-0"></div>
                        {items.map((item, idx) => (
                            <TimelineItem 
                                key={item.id} 
                                item={item} 
                                index={idx} 
                                isCurrent={idx === currentIndex} 
                                isPast={idx < currentIndex} 
                                onClick={() => handleJumpToStage(idx)} 
                                formatTime={formatTime} 
                            />
                        ))}
                    </div>

                    <div className="p-4 bg-[#112116] border-t border-[#244730] flex items-center justify-center gap-4">
                        <button onClick={() => setIsPaused(!isPaused)} className={`size-14 rounded-full flex items-center justify-center transition-all ${isPaused ? 'bg-[#ffc107] text-black hover:bg-[#ffc107]/90' : 'bg-[#13ec5b] text-black hover:bg-[#13ec5b]/90 shadow-[0_0_20px_rgba(19,236,91,0.3)]'}`}>
                            {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
                        </button>
                    </div>
                </div>
            </main>

            <div className={`h-1.5 md:h-2 w-full bg-slate-900 transition-all ${isFullscreen ? 'absolute bottom-0 z-50' : ''}`}>
                <div className={`h-full bg-[#13ec5b] transition-all duration-1000 ease-linear ${isPaused ? 'opacity-50' : 'opacity-100'}`} style={{ width: `${progressPercent}%` }}>
                    <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white/50 blur-[2px]"></div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDashboard;
