

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

/**
 * 通用的刪除確認彈窗
 */
export const DeleteModal = ({ isOpen, onClose, onConfirm, title = "Delete Stage?", message = "Are you sure you want to delete this training stage? This action cannot be undone." }: DeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#346544] rounded-2xl p-6 md:p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center">
                <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[32px]">warning</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tight text-center">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8">{message}</p>
                <div className="flex w-full gap-3">
                    <button 
                        onClick={onClose} 
                        className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-[#346544] text-slate-700 dark:text-slate-300 font-bold uppercase hover:bg-slate-50 dark:hover:bg-[#1a2e22] transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold uppercase hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
