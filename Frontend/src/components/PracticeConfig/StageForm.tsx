import { TimeSelect } from '../common/TimeSelect';

interface StageFormProps {
    editingId: string | 'NEW';
    editName: string;
    setEditName: (v: string) => void;
    editUrl: string;
    setEditUrl: (v: string) => void;
    editPracticeDuration: string;
    setEditPracticeDuration: (v: string) => void;
    editRestDuration: string;
    setEditRestDuration: (v: string) => void;
    editStartSecond: string;
    setEditStartSecond: (v: string) => void;
    editEndSecond: string;
    setEditEndSecond: (v: string) => void;
    onSave: (e: React.MouseEvent) => void;
    onCancel: () => void;
    extractVideoId: (url: string) => string | null;
    handleStartSecondChange: (val: string) => void;
    handleEndSecondChange: (val: string) => void;
}

export const StageForm = ({
    editingId,
    editName,
    setEditName,
    editUrl,
    setEditUrl,
    editPracticeDuration,
    setEditPracticeDuration,
    editRestDuration,
    setEditRestDuration,
    editStartSecond,
    editEndSecond,
    onSave,
    onCancel,
    extractVideoId,
    handleStartSecondChange,
    handleEndSecondChange
}: StageFormProps) => {
    return (
        <aside className="relative w-full md:w-[400px] bg-white dark:bg-[#112217] border-l border-slate-200 dark:border-[#244730] shadow-xl flex flex-col shrink-0 absolute inset-y-0 right-0 z-50 md:static">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-[#244730] bg-white dark:bg-[#112217]">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                        {editingId === 'NEW' ? 'New Stage' : 'Edit Stage'}
                    </h2>
                </div>
                <button onClick={onCancel} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold uppercase tracking-tight text-slate-700 dark:text-[#93c8a5]">Video Source URL</label>
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <span className="material-symbols-outlined text-[18px]">link</span>
                        </div>
                        <input
                            className="w-full bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#346544] rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] focus:ring-1 focus:ring-[#19e65e] placeholder-slate-500"
                            placeholder="Paste YouTube URL"
                            type="url"
                            required
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                        />
                    </div>
                    {editUrl && extractVideoId(editUrl) && (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black group border border-slate-200 dark:border-[#244730]">
                            <img className="w-full h-full object-cover opacity-60 transition-opacity" src={`https://img.youtube.com/vi/${extractVideoId(editUrl)}/hqdefault.jpg`} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold uppercase tracking-tight text-slate-700 dark:text-[#93c8a5]">Stage Name</label>
                    <input
                        className="w-full bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#346544] rounded-lg py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] focus:ring-1 focus:ring-[#19e65e] font-bold placeholder-slate-500"
                        type="text"
                        placeholder="e.g. Warm Up"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                    />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#244730] flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-1 text-[#19e65e]">
                        <span className="material-symbols-outlined">timer</span>
                        <h3 className="font-bold text-sm uppercase tracking-widest">Practice Duration</h3>
                    </div>
                    <TimeSelect value={editPracticeDuration} onChange={setEditPracticeDuration} />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#244730] flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-[#93c8a5]">
                        <span className="material-symbols-outlined">movie</span>
                        <h3 className="font-bold text-sm uppercase tracking-widest">Video Segment</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Start Time</span>
                            <TimeSelect value={editStartSecond} onChange={handleStartSecondChange} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">End Time</span>
                            <TimeSelect value={editEndSecond} onChange={handleEndSecondChange} allowEmpty={true} />
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#244730] flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-[#93c8a5]">
                            <span className="material-symbols-outlined">timer_off</span>
                            <h3 className="font-bold text-sm uppercase tracking-widest">Rest Time</h3>
                        </div>
                    </div>
                    <TimeSelect value={editRestDuration} onChange={setEditRestDuration} />
                </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-[#244730] bg-white dark:bg-[#112217] flex gap-3">
                <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 rounded-lg border border-slate-300 dark:border-[#346544] text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-tight hover:bg-slate-50 dark:hover:bg-[#1a2e22] transition-colors">
                    Cancel
                </button>
                <button type="button" onClick={onSave} className="flex-1 py-3 px-4 rounded-lg bg-[#19e65e] text-[#112217] font-bold text-sm uppercase tracking-tight hover:bg-[#19e65e]/90 transition-colors shadow-lg shadow-[#19e65e]/20">
                    Save Stage
                </button>
            </div>
        </aside>
    );
};
