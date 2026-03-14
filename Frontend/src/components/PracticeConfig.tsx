import React, { useState, useMemo } from 'react';
import { usePracticeStore } from '../hooks/usePracticeStore';
import { DeleteModal } from './common/DeleteModal';
import { StageItem } from './PracticeConfig/StageItem';
import { StageForm } from './PracticeConfig/StageForm';
import { type StageResponse } from '../types';

interface PracticeConfigProps {
    onStartPractice?: () => void;
    onBack?: () => void;
}

export const PracticeConfig: React.FC<PracticeConfigProps> = ({ onStartPractice, onBack }) => {
    const { items, addItem, removeItem, updateItem, moveItem, restVideoUrl, setRestVideoUrl } = usePracticeStore();

    const [editingId, setEditingId] = useState<string | 'NEW' | null>(null);
    const [editName, setEditName] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editPracticeDuration, setEditPracticeDuration] = useState('00:01:00');
    const [editRestDuration, setEditRestDuration] = useState('00:00:15');
    const [editStartSecond, setEditStartSecond] = useState('00:00:00');
    const [editEndSecond, setEditEndSecond] = useState('');
    const [localRestUrl, setLocalRestUrl] = useState('');
    const [stageToDelete, setStageToDelete] = useState<string | null>(null);

    React.useEffect(() => {
        if (restVideoUrl && !localRestUrl) {
            setLocalRestUrl(restVideoUrl);
        }
    }, [restVideoUrl, localRestUrl]);

    const timeToSeconds = (timeStr: string) => {
        if (!timeStr) return 0;
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return parts[0] || 0;
    };

    const secondsToTime = (secs: number) => {
        if (secs === undefined || isNaN(secs)) return '';
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const totalSeconds = useMemo(() => {
        return items.reduce((acc, item) => acc + item.practiceSeconds + item.restSeconds, 0);
    }, [items]);

    const formatTotalTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleEditStart = (item: StageResponse) => {
        setEditingId(item.id);
        setEditName(item.stageName);
        setEditUrl(item.youtubeUrl || '');
        setEditPracticeDuration(secondsToTime(item.practiceSeconds));
        setEditRestDuration(secondsToTime(item.restSeconds));
        setEditStartSecond(item.startSecond !== undefined ? secondsToTime(item.startSecond) : '00:00:00');
        setEditEndSecond(item.endSecond !== undefined ? secondsToTime(item.endSecond) : '');
    };

    const handleAddNewClick = () => {
        setEditingId('NEW');
        setEditName('');
        setEditUrl('');
        setEditPracticeDuration('00:01:00');
        setEditRestDuration('00:00:15');
        setEditStartSecond('00:00:00');
        setEditEndSecond('');
    };

    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleStartSecondChange = (val: string) => {
        setEditStartSecond(val);
        const startSec = timeToSeconds(val);
        if (editEndSecond) {
            const endSec = timeToSeconds(editEndSecond);
            if (endSec <= startSec) {
                setEditEndSecond(secondsToTime(startSec + 1));
            }
        }
    };

    const handleEndSecondChange = (val: string) => {
        if (!val) {
            setEditEndSecond('');
            return;
        }
        const startSec = timeToSeconds(editStartSecond);
        const endSec = timeToSeconds(val);
        if (endSec <= startSec) {
            setEditEndSecond(secondsToTime(startSec + 1));
            return;
        }
        setEditEndSecond(val);
    };

    const handleEditSave = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (!editName || !editUrl) {
            alert('請完整填寫名稱與網址');
            return;
        }
        const startSec = timeToSeconds(editStartSecond);
        const endSec = editEndSecond ? timeToSeconds(editEndSecond) : undefined;
        const pracSec = timeToSeconds(editPracticeDuration);
        const restSec = timeToSeconds(editRestDuration);

        if (endSec !== undefined && endSec <= startSec) {
            alert('影片結束時間必須大於開始時間！');
            return;
        }
        if (pracSec <= 0) {
            alert('訓練時間必須大於 0 秒');
            return;
        }

        const payload = {
            stageName: editName,
            youtubeUrl: editUrl,
            practiceSeconds: pracSec,
            restSeconds: restSec,
            startSecond: startSec,
            endSecond: endSec ?? 0,
        };

        if (editingId === 'NEW') {
            addItem(payload);
        } else if (editingId) {
            updateItem(editingId, payload);
        }
        setEditingId(null);
    };

    let accumulatedTime = 0;

    return (
        <div className="flex flex-col h-screen bg-[#f6f8f6] dark:bg-[#112116] text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#244730] px-4 md:px-10 py-4 bg-white dark:bg-[#112116] sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <div className="size-8 flex items-center justify-center rounded-lg bg-[#19e65e]/20 text-[#19e65e]">
                        <span className="material-symbols-outlined">fitness_center</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight uppercase">My Training Plan</h2>
                </div>
            </header>

            <div className="flex flex-1 relative h-[calc(100vh-73px)] overflow-hidden">
                <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 p-4 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#244730]">
                            <div className="flex flex-col gap-2">
                                <button type="button" onClick={onBack} className="flex w-max items-center gap-2 text-sm text-[#19e65e] font-medium uppercase tracking-tight hover:underline">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    <span>Back to Project Overview</span>
                                </button>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Training Configuration</h1>
                                <p className="text-slate-500 dark:text-[#93c8a5] tracking-tight">Configure your interval training stages sequentially</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#1a2e22] text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 mr-2">
                                    <span className="material-symbols-outlined text-[18px]">timer</span>
                                    Total: {formatTotalTime(totalSeconds)} min
                                </div>
                                <button onClick={onStartPractice} disabled={items.length === 0} className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-[#19e65e] text-[#112217] text-sm font-bold shadow-lg shadow-[#19e65e]/20 hover:bg-[#19e65e]/90 transition-all gap-2 uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                                    Start Training
                                </button>
                            </div>
                        </div>

                        {/* 全域休息部影片設定 */}
                        <div className="mb-2 bg-white dark:bg-[#1a2e22] border border-slate-200 dark:border-[#244730] rounded-xl p-4 shadow-sm">
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300 uppercase tracking-tight">Global Rest Background Video</label>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <span className="material-symbols-outlined text-[18px]">link</span>
                                        </div>
                                        <input
                                            type="url"
                                            className="w-full bg-slate-50 dark:bg-[#112217] border border-slate-200 dark:border-[#346544] rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] focus:ring-1 focus:ring-[#19e65e]"
                                            value={localRestUrl}
                                            onChange={e => setLocalRestUrl(e.target.value)}
                                            onBlur={() => setRestVideoUrl(localRestUrl)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-[#93c8a5]">Plays during rest periods. Auto-starts at a random time if it's a long video.</p>
                                </div>
                                {localRestUrl && extractVideoId(localRestUrl) && (
                                    <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-slate-200 dark:border-[#244730]">
                                        <img className="w-full h-full object-cover opacity-80" src={`https://img.youtube.com/vi/${extractVideoId(localRestUrl)}/hqdefault.jpg`} alt="Rest Video Preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative pl-4 md:pl-0">
                            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-[#244730] md:left-[80px] z-0"></div>

                            {items.length === 0 && (
                                <div className="pl-12 md:pl-[120px] py-8 text-slate-500 dark:text-[#93c8a5]">
                                    Timeline is empty. Add stages below to build your training plan.
                                </div>
                            )}

                            {items.map((item, index) => {
                                const startAcc = accumulatedTime;
                                const endAcc = accumulatedTime + item.practiceSeconds;
                                accumulatedTime += (item.practiceSeconds + item.restSeconds);

                                return (
                                    <StageItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        isEditing={editingId === item.id}
                                        accumulatedTime={{ start: startAcc, end: endAcc }}
                                        onEdit={handleEditStart}
                                        onDelete={setStageToDelete}
                                        onMove={moveItem}
                                        isFirst={index === 0}
                                        isLast={index === items.length - 1}
                                        extractVideoId={extractVideoId}
                                        secondsToTime={secondsToTime}
                                        formatTotalTime={formatTotalTime}
                                    />
                                );
                            })}
                        </div>

                        <div className="flex justify-center mt-6 mb-20 pl-12 md:pl-0">
                            <button type="button" onClick={handleAddNewClick} className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-slate-300 dark:border-[#346544] text-slate-500 dark:text-[#93c8a5] hover:border-[#19e65e] hover:text-[#19e65e] hover:bg-slate-50 dark:hover:bg-[#1a2e22] transition-all w-full md:w-auto subtitle-center uppercase tracking-tight font-bold">
                                <span className="material-symbols-outlined">add_circle</span>
                                <span>Add New Stage</span>
                            </button>
                        </div>
                    </div>
                </main>

                {editingId && (
                    <StageForm
                        editingId={editingId}
                        editName={editName}
                        setEditName={setEditName}
                        editUrl={editUrl}
                        setEditUrl={setEditUrl}
                        editPracticeDuration={editPracticeDuration}
                        setEditPracticeDuration={setEditPracticeDuration}
                        editRestDuration={editRestDuration}
                        setEditRestDuration={setEditRestDuration}
                        editStartSecond={editStartSecond}
                        setEditStartSecond={setEditStartSecond}
                        editEndSecond={editEndSecond}
                        setEditEndSecond={setEditEndSecond}
                        onSave={handleEditSave}
                        onCancel={() => setEditingId(null)}
                        extractVideoId={extractVideoId}
                        handleStartSecondChange={handleStartSecondChange}
                        handleEndSecondChange={handleEndSecondChange}
                    />
                )}
            </div>

            <DeleteModal
                isOpen={!!stageToDelete}
                onClose={() => setStageToDelete(null)}
                onConfirm={() => { if (stageToDelete) removeItem(stageToDelete); setStageToDelete(null); }}
            />
        </div>
    );
};

export default PracticeConfig;
