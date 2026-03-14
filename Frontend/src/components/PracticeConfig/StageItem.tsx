import { type StageResponse } from '../../types';

interface StageItemProps {
    item: StageResponse;
    index: number;
    isEditing: boolean;
    accumulatedTime: { start: number; end: number };
    onEdit: (item: StageResponse) => void;
    onDelete: (id: string) => void;
    onMove: (index: number, direction: 'UP' | 'DOWN') => void;
    isFirst: boolean;
    isLast: boolean;
    extractVideoId: (url: string) => string | null;
    secondsToTime: (secs: number) => string;
    formatTotalTime: (secs: number) => string;
}

export const StageItem = ({ 
    item, 
    index, 
    isEditing, 
    accumulatedTime, 
    onEdit, 
    onDelete, 
    onMove, 
    isFirst, 
    isLast, 
    extractVideoId, 
    secondsToTime, 
    formatTotalTime 
}: StageItemProps) => {
    return (
        <div className="relative grid grid-cols-[auto_1fr] gap-4 md:gap-8 items-start group mb-2">
            {/* 左側序號與時間標記 */}
            <div className="relative flex flex-col items-center pt-2 z-10 w-[60px] md:w-[160px]">
                <div className={`absolute right-[-24px] md:right-[60px] top-4 size-12 rounded-full border-4 ${isEditing ? 'border-[#19e65e] bg-[#19e65e] text-[#112217] shadow-[0_0_15px_rgba(25,230,94,0.4)]' : 'border-white dark:border-[#112116] bg-slate-100 dark:bg-[#1a2e22] text-slate-400 dark:text-[#93c8a5]'} flex items-center justify-center cursor-pointer shadow-md z-20 transition-colors`}>
                    <span className="font-bold text-lg">{index + 1}</span>
                </div>
                <div className="hidden md:block absolute right-[120px] top-5 text-right w-32">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">{formatTotalTime(accumulatedTime.start)}</span>
                    <span className="block text-xs text-slate-500 dark:text-[#93c8a5]">to {formatTotalTime(accumulatedTime.end)}</span>
                </div>
            </div>

            {/* 右側卡片內容 */}
            <div className="pl-12 md:pl-0 w-full">
                <div className={`bg-white dark:bg-[#1a2e22] border ${isEditing ? 'border-[#19e65e] ring-1 ring-[#19e65e]/20' : 'border-slate-200 dark:border-[#244730]'} rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#19e65e]/50 transition-all group relative`}>
                    {isEditing && (
                        <div className="absolute right-0 top-0 p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#19e65e] text-[#112217] uppercase tracking-widest">Editing</span>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* 影片縮圖 */}
                        <div className="w-full sm:w-40 aspect-video rounded-lg bg-slate-200 dark:bg-[#112217] shrink-0 relative overflow-hidden group/thumb cursor-pointer border border-[#244730]">
                            {item.youtubeUrl ? (
                                <img src={`https://img.youtube.com/vi/${extractVideoId(item.youtubeUrl)}/hqdefault.jpg`} className="w-full h-full object-cover opacity-80" alt="Thumbnail" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-600">movie</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg">play_circle</span>
                            </div>
                            <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-mono">{secondsToTime(item.practiceSeconds)}</span>
                        </div>

                        {/* 文字資訊 */}
                        <div className="flex flex-col flex-1 min-w-0 w-full">
                            <div className="flex justify-between items-start mr-16 sm:mr-0">
                                <div className="flex-1 truncate">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg uppercase tracking-tight truncate">{item.stageName}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 truncate">{item.youtubeUrl}</p>
                                </div>
                            </div>

                            {/* 操作按鈕 */}
                            <div className="flex items-center gap-1 mt-2 sm:mt-0 sm:absolute sm:right-4 sm:top-4">
                                <button onClick={() => onMove(index, 'UP')} disabled={isFirst} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] text-slate-400 disabled:opacity-30 flex items-center justify-center" title="Move Up"><span className="material-symbols-outlined text-[18px]">arrow_upward</span></button>
                                <button onClick={() => onMove(index, 'DOWN')} disabled={isLast} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] text-slate-400 disabled:opacity-30 flex items-center justify-center" title="Move Down"><span className="material-symbols-outlined text-[18px]">arrow_downward</span></button>
                                <button onClick={() => onEdit(item)} className={`size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] transition-colors flex items-center justify-center ${isEditing ? 'text-[#19e65e]' : 'text-slate-400 hover:text-blue-400'}`} title="Edit">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button onClick={() => onDelete(item.id)} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center" title="Delete">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>

                            {/* 階段詳情標記 */}
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-[#112217]/50 p-2 rounded-lg border border-slate-100 dark:border-[#244730]/50 w-fit">
                                <span className="flex items-center gap-1 text-[#19e65e] font-bold uppercase tracking-tight"><span className="material-symbols-outlined text-[14px]">timer</span> Rest: {item.restSeconds}s</span>
                                {(item.startSecond !== undefined || item.endSecond !== undefined) && (
                                    <>
                                        <div className="w-px h-3 bg-slate-300 dark:bg-[#244730]"></div>
                                        <span className="flex items-center gap-1 uppercase tracking-tight"><span className="material-symbols-outlined text-[14px]">smart_display</span> Clip: {secondsToTime(item.startSecond || 0)} - {item.endSecond ? secondsToTime(item.endSecond) : 'End'}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
