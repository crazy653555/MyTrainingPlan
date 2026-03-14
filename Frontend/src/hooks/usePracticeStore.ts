import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { z } from 'zod';
import api from '../api';
import { 
    type ProjectResponse, 
    type StageResponse, 
    type StageUpsertRequest, 
    ProjectResponseSchema, 
    StageResponseSchema
} from '../types';

// V1 版本預設寫死的專案 ID
const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

/// <summary>
/// 管理所有訓練階段狀態的自訂 Hook (搭配 React Query 使用與後端溝通)
/// </summary>
export const usePracticeStore = () => {
    // 取得 React Query 的 Client，以利後續呼叫 invalidateQueries 刷新快取
    const queryClient = useQueryClient();

    // ===============
    // 取得與更新「專案資料」
    // ===============

    // 呼叫 API 取得專案詳細資料 (主要是為了獲取全域休息影片設定)
    const { data: projectData } = useQuery<ProjectResponse>({
        queryKey: ['project', PROJECT_ID],
        queryFn: async () => {
            const res = await api.get(`/projects/${PROJECT_ID}`);
            // 使用 Zod 驗證回傳資料結構
            return ProjectResponseSchema.parse(res.data);
        }
    });

    // 取得專案的全域休息影片網址，如果沒有設定則套用預設的環境音/風景影片
    const restVideoUrl = projectData?.globalRestVideoUrl || 'https://www.youtube.com/watch?v=leZaQ2JIvTM';

    // 呼叫 API 更新專案的全域影片設定
    const updateProjectMutation = useMutation({
        mutationFn: async (newUrl: string) => {
            if (!projectData) return;
            await api.put(`/projects/${PROJECT_ID}`, {
                name: projectData.name, // 依照後端 DTO 結構傳遞
                globalRestVideoUrl: newUrl
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', PROJECT_ID] });
            toast.success('專案設定已更新');
        },
        onError: (err: any) => {
            console.error('Update project failed:', err);
            toast.error('更專案設定失敗');
        }
    });

    // 對外部匯出的「設定全域影片網址」方法
    const setRestVideoUrl = (url: string) => {
        updateProjectMutation.mutate(url);
    };

    // ===============
    // 取得「訓練階段」列表
    // ===============

    // 取得此專案底下的所有訓練階段 (Practice Items)
    const { data: items = [] } = useQuery<StageResponse[]>({
        queryKey: ['stages', PROJECT_ID],
        queryFn: async () => {
            const res = await api.get(`/stages/project/${PROJECT_ID}`);
            // 使用 Zod 驗證陣列中每個項目的結構
            return z.array(StageResponseSchema).parse(res.data);
        }
    });

    // ===============
    // 異動「訓練階段」的各項 Mutations (新增、修改、刪除、排序)
    // ===============

    // 新增訓練階段 API 呼叫
    const addMutation = useMutation({
        mutationFn: async (item: StageUpsertRequest) => {
            await api.post('/stages', { ...item, projectId: PROJECT_ID });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stages', PROJECT_ID] });
            toast.success('已新增訓練階段');
        },
        onError: (err: any) => {
            console.error('Add stage failed:', err);
            toast.error('新增階段失敗');
        }
    });

    // 更新訓練階段 API 呼叫
    const updateMutation = useMutation({
        mutationFn: async ({ id, updatedFields }: { id: string, updatedFields: Partial<StageUpsertRequest> }) => {
            const target = items.find(i => i.id === id);
            if (!target) return;
            // 結合原有資料再覆蓋更新的欄位，並過濾掉 id/projectId 等不應在 Body 中的欄位
            const { id: _, projectId: __, orderIdx: ___, ...rest } = target;
            await api.put(`/stages/${id}`, { ...rest, ...updatedFields });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stages', PROJECT_ID] });
            toast.success('階段已更新');
        },
        onError: (err: any) => {
            console.error('Update stage failed:', err);
            toast.error('更新階段失敗');
        }
    });

    // 刪除訓練階段 API 呼叫
    const removeMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/stages/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stages', PROJECT_ID] });
            toast.success('已刪除階段');
        },
        onError: (err: any) => {
            console.error('Delete stage failed:', err);
            toast.error('刪除階段失敗');
        }
    });

    // 儲存新的排序到後端的 API 呼叫
    const reorderMutation = useMutation({
        mutationFn: async (updates: { id: string, orderIdx: number }[]) => {
            await api.put(`/stages/project/${PROJECT_ID}/reorder`, updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stages', PROJECT_ID] });
            // 排序通常不需要 toast，避免過於頻繁
        },
        onError: (err: any) => {
            console.error('Reorder failed:', err);
            toast.error('排序更新失敗，請重新整理');
            // 發生錯誤時，刷新資料以恢復正確順序
            queryClient.invalidateQueries({ queryKey: ['stages', PROJECT_ID] });
        }
    });

    // 提供給外部元件呼叫的包裝方法
    const addItem = (item: StageUpsertRequest) => addMutation.mutate(item);

    const updateItem = (id: string, updatedFields: Partial<StageUpsertRequest>) => {
        updateMutation.mutate({ id, updatedFields });
    };

    const removeItem = (id: string) => removeMutation.mutate(id);

    // 處理前端畫面上階段上下移動的邏輯
    const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
        // 邊界檢查：最上方無法再往上，最下方無法再往下
        if (
            (direction === 'UP' && index === 0) ||
            (direction === 'DOWN' && index === items.length - 1)
        ) return;

        // 複製一份陣列用來交換位置
        const newItems = [...items];
        const swapIndex = direction === 'UP' ? index - 1 : index + 1;
        // 陣列元素位置交換
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];

        // 為了避免畫面閃爍或載入中斷層，我們先在本地樂觀更新 (Optimistic Update)
        queryClient.setQueryData(['stages', PROJECT_ID], newItems);

        // 將最新陣列順序轉換成所有階段的新 OrderIdx
        const updates = newItems.map((item, idx) => ({ id: item.id, orderIdx: idx }));
        // 然後才非同步送出更新請求給後端
        reorderMutation.mutate(updates);
    };

    // 匯出各狀態變數與操作方法給 Component
    return {
        items,
        addItem,
        updateItem,
        removeItem,
        moveItem,
        restVideoUrl,
        setRestVideoUrl
    };
};
