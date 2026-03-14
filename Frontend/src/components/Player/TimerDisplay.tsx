

interface TimerDisplayProps {
    timeLeft: number;
    statusText: string;
    formatTime: (secs: number) => string;
}

/**
 * 顯示倒數計時與當前狀態的 Overlay
 */
export const TimerDisplay = ({ timeLeft, statusText, formatTime }: TimerDisplayProps) => {
    return (
        <div className="absolute top-8 left-0 w-full flex justify-center z-20 pointer-events-none px-4">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-6 md:px-12 py-4 md:py-6 shadow-2xl flex flex-col items-center">
                <span className="text-[#13ec5b] text-xs md:text-sm font-bold tracking-[0.2em] mb-1 uppercase">
                    {statusText}
                </span>
                <span className="font-mono text-5xl md:text-7xl font-bold tracking-tighter text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {formatTime(timeLeft)}
                </span>
            </div>
        </div>
    );
};
