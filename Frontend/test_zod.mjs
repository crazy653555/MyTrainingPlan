// 測試 Zod schema 是否能正確解析後端 API 回傳的資料
import { z } from 'zod';

// 模擬後端 API 回傳的資料（直接從 API 來的原始格式）
const mockApiResponse = {
  "id": "00000000-0000-0000-0000-000000000001",
  "name": "預設專案",
  "globalRestVideoUrl": "",  // 後端回傳空字串
  "createdAt": "2025-01-01T00:00:00",  // 無時區
  "updatedAt": "2025-01-01T00:00:00",
  "stages": [
    {
      "id": "f4d8af6d-5f9c-4ac1-b677-d953f7105699",
      "projectId": "00000000-0000-0000-0000-000000000001",
      "stageName": "酒後誤事",
      "youtubeUrl": "https://www.youtube.com/watch?v=zt7hjhPRtUc",
      "practiceSeconds": 60,
      "restSeconds": 15,
      "startSecond": 364,
      "endSecond": 376,
      "orderIdx": 0
    }
  ]
};

const StageResponseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  stageName: z.string(),
  youtubeUrl: z.string().nullable().optional().transform(v => v || null),
  practiceSeconds: z.number().int().nonnegative(),
  restSeconds: z.number().int().nonnegative(),
  startSecond: z.number().int().nonnegative(),
  endSecond: z.number().int().nonnegative().nullable().optional(),
  orderIdx: z.number().int().nonnegative()
});

const ProjectResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  globalRestVideoUrl: z.string().nullable().optional().transform(v => v || null),
  createdAt: z.string(),
  updatedAt: z.string(),
  stages: z.array(StageResponseSchema)
});

try {
  const result = ProjectResponseSchema.parse(mockApiResponse);
  console.log('✅ Zod 解析成功！');
  console.log('globalRestVideoUrl:', result.globalRestVideoUrl);
  console.log('stages count:', result.stages.length);
} catch (err) {
  console.error('❌ Zod 解析失敗！');
  console.error(err);
}
