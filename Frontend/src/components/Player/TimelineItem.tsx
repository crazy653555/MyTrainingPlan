
import { type StageResponse } from '../../types';

interface TimelineItemProps {
    item: StageResponse;
    index: number;
    isCurrent: boolean;
    isPast: boolean;
    onClick: () => void;
    formatTime: (secs: number) => string;
}

export const TimelineItem = ({ item, index, isCurrent, isPast, onClick, formatTime }: TimelineItemProps) => {
    return (
        <div 
            onClick={onClick} 
            className={`relative z-10 flex gap-4 transition-all cursor-pointer hover:bg-white/5 rounded-xl p-1 ${isPast ? 'opacity-50 grayscale' : ''} ${isCurrent ? 'transform scale-[1.02]' : ''}`}
        >
            <div className="flex flex-col items-center mt-1">
                <div className={`size-8 rounded-full border-2 flex items-center justify-center bg-[#112116] z-10 transition-colors ${isCurrent ? 'border-[#13ec5b] text-[#13ec5b] shadow-[0_0_15px_rgba(19,236,91,0.4)]' : isPast ? 'border-[#346544] text-[#346544]' : 'border-slate-600 text-slate-500'}`}>
                    {isPast ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                    ) : (
                        <span className="text-[10px] font-mono font-bold hover:cursor-default">{index + 1}</span>
                    )}
                </div>
            </div>
            <div className={`flex-1 rounded-xl p-3 border transition-all ${isCurrent ? 'bg-[#1a2e22] border-[#13ec5b]/50 shadow-[0_0_20px_rgba(19,236,91,0.1)]' : 'bg-[#15291b] border-transparent'}`}>
                <div className="flex justify-between items-start mb-1 gap-2">
                    <div className="flex flex-col">
                        <h4 className={`font-medium text-sm truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{item.stageName}</h4>
                        {item.restSeconds > 0 && (
                            <span className={`text-[10px] mt-0.5 ${isCurrent ? 'text-[#13ec5b]/80' : 'text-slate-500'}`}>Rest: {formatTime(item.restSeconds)}</span>
                        )}
                    </div>
                    <span className={`text-xs font-mono shrink-0 ${isCurrent ? 'text-[#13ec5b]' : 'text-slate-500'}`}>{formatTime(item.practiceSeconds)}</span>
                </div>
                {isCurrent && (
                    <div className="flex gap-2 text-[10px] mt-2">
                        <span className="bg-[#13ec5b]/10 text-[#13ec5b] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider border border-[#13ec5b]/20">Active</span>
                    </div>
                )}
            </div>
        </div>
    );
};
