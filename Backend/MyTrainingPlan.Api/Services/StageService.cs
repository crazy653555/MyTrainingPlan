using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;
using MyTrainingPlan.Api.Repositories;

namespace MyTrainingPlan.Api.Services
{
    /// <summary>
    /// 實作 IStageService 的訓練階段業務邏輯服務層
    /// 負責處理與各個訓練階段相關的各項商業邏輯，包含新增、重新排序等
    /// </summary>
    public class StageService : IStageService
    {
        private readonly IStageRepository _stageRepository;

        /// <summary>
        /// 初始化 <see cref="StageService"/> 類別的新執行個體
        /// </summary>
        /// <param name="stageRepository">注入階段資料存取庫</param>
        public StageService(IStageRepository stageRepository)
        {
            _stageRepository = stageRepository;
        }

        /// <summary>
        /// 取得專案底下的所有訓練階段
        /// </summary>
        public async Task<IEnumerable<Stage>> GetStagesByProjectAsync(Guid projectId)
        {
            return await _stageRepository.GetStagesByProjectIdAsync(projectId);
        }

        /// <summary>
        /// 根據階段 ID 取得特定的階段詳情
        /// </summary>
        public async Task<Stage?> GetStageAsync(Guid id)
        {
            return await _stageRepository.GetByIdAsync(id);
        }

        /// <summary>
        /// 建立一個新的訓練階段
        /// 若未特別指定排序順序 (OrderIdx == 0)，會自動排在目前該專案中所有階段的最後面
        /// </summary>
        public async Task<Stage> CreateStageAsync(Stage stage)
        {
            stage.Id = Guid.NewGuid();

            // 若使用者未特意設定順序或為預設值，幫他自動帶入 (目前最大值+1)
            if (stage.OrderIdx == 0)
            {
                var maxOrder = await _stageRepository.GetMaxOrderIdxAsync(stage.ProjectId);
                stage.OrderIdx = maxOrder < 0 ? 0 : maxOrder + 1;
            }

            await _stageRepository.AddAsync(stage);
            await _stageRepository.SaveChangesAsync();
            return stage;
        }

        /// <summary>
        /// 更新現有的特定訓練階段
        /// </summary>
        public async Task UpdateStageAsync(Stage stage)
        {
            await _stageRepository.UpdateAsync(stage);
            await _stageRepository.SaveChangesAsync();
        }

        /// <summary>
        /// 刪除特定的訓練階段
        /// </summary>
        public async Task DeleteStageAsync(Guid id)
        {
            await _stageRepository.DeleteByIdAsync(id);
            await _stageRepository.SaveChangesAsync();
        }

        /// <summary>
        /// 重新排列專案中所有階段的排序
        /// 這個方法會尋訪清單中的所有階段並更新其 OrderIdx 欄位
        /// </summary>
        public async Task UpdateStagesOrderAsync(Guid projectId, IEnumerable<StageOrderUpdateDto> updates)
        {
            foreach (var update in updates)
            {
                var stage = await _stageRepository.GetByIdAsync(update.Id);
                // 確保更新的階段真的屬於該專案
                if (stage != null && stage.ProjectId == projectId)
                {
                    stage.OrderIdx = update.OrderIdx;
                    await _stageRepository.UpdateAsync(stage);
                }
            }
            await _stageRepository.SaveChangesAsync();
        }
    }
}
