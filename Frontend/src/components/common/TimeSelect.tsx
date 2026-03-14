

interface TimeSelectProps {
    value: string;
    onChange: (v: string) => void;
    allowEmpty?: boolean;
    emptyLabel?: string;
}

/**
 * 共用的時間選擇元件 (包含時、分、秒下拉選單)
 */
export const TimeSelect = ({ value, onChange, allowEmpty = false, emptyLabel = "End" }: TimeSelectProps) => {
    const isEmpty = value === '';
    const parts = isEmpty ? ['00', '00', '00'] : value.split(':');
    const h = parts[0] || '00';
    const m = parts[1] || '00';
    const s = parts[2] || '00';

    const update = (newH: string, newM: string, newS: string) => onChange(`${newH}:${newM}:${newS}`);

    return (
        <div className="grid grid-cols-3 gap-2">
            {!isEmpty && (
                <>
                    <div className="relative">
                        <select 
                            required 
                            value={h} 
                            onChange={(e) => update(e.target.value, m, s)} 
                            className="w-full appearance-none bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#346544] rounded-lg py-2 px-1 text-center font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] custom-scrollbar"
                        >
                            {Array.from({ length: 24 }).map((_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}h</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <select 
                            required 
                            value={m} 
                            onChange={(e) => update(h, e.target.value, s)} 
                            className="w-full appearance-none bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#346544] rounded-lg py-2 px-1 text-center font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] custom-scrollbar"
                        >
                            {Array.from({ length: 60 }).map((_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}m</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <select 
                            required 
                            value={s} 
                            onChange={(e) => update(h, m, e.target.value)} 
                            className="w-full appearance-none bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#346544] rounded-lg py-2 px-1 text-center font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] custom-scrollbar"
                        >
                            {Array.from({ length: 60 }).map((_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}s</option>
                            ))}
                        </select>
                    </div>
                </>
            )}
            {allowEmpty && (
                <label className="col-span-3 flex items-center gap-2 cursor-pointer text-slate-400 text-sm mt-1">
                    <input 
                        type="checkbox" 
                        className="rounded border-gray-700 bg-[#1a2e22] text-[#19e65e] focus:ring-[#19e65e]" 
                        checked={isEmpty} 
                        onChange={(e) => onChange(e.target.checked ? '' : '00:00:00')} 
                    />
                    <span>{emptyLabel} (Play to end)</span>
                </label>
            )}
        </div>
    );
};
