import { z } from 'zod';

/**
 * 專案回傳資料傳輸物件 (與後端 ProjectResponse 同步)
 */
export const ProjectResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  globalRestVideoUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  stages: z.array(z.lazy(() => StageResponseSchema))
});

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;

/**
 * 階段回傳資料傳輸物件 (與後端 StageResponse 同步)
 */
export const StageResponseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  stageName: z.string(),
  youtubeUrl: z.string().nullable(),
  practiceSeconds: z.number().int().nonnegative(),
  restSeconds: z.number().int().nonnegative(),
  startSecond: z.number().int().nonnegative(),
  endSecond: z.number().int().nonnegative(),
  orderIdx: z.number().int().nonnegative()
});

export type StageResponse = z.infer<typeof StageResponseSchema>;

/**
 * 階段新增或更新請求物件 (與後端 StageUpsertRequest 同步)
 */
export const StageUpsertRequestSchema = z.object({
  projectId: z.string().uuid().optional(),
  stageName: z.string().min(1, '階段名稱為必填').max(100, '階段名稱長度不能超過 100 字元'),
  youtubeUrl: z.string().nullable().optional(),
  practiceSeconds: z.number().int().nonnegative(),
  restSeconds: z.number().int().nonnegative(),
  startSecond: z.number().int().nonnegative(),
  endSecond: z.number().int().nonnegative(),
  orderIdx: z.number().int().nonnegative().optional()
});

export type StageUpsertRequest = z.infer<typeof StageUpsertRequestSchema>;

/**
 * 代表一個單獨訓練階段 (Stage) 的資料結構 (相容舊版名稱，建議逐步替換為 StageResponse)
 */
export interface PracticeItem extends StageResponse {}

/**
 * 定義整個訓練計畫在播放時可能處於的狀態
 * IDLE (閒置) -> PREPARING (預備倒數) -> PRACTICING (訓練中) -> RESTING (休息中) -> FINISHED (全部完成)
 */
export type TimerState = 'IDLE' | 'PREPARING' | 'PRACTICING' | 'RESTING' | 'FINISHED';
