using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Services
{
    /// <summary>
    /// 定義訓練階段 (Stage) 管理功能的業務邏輯介面
    /// </summary>
    public interface IStageService
    {
        /// <summary>
        /// 取得專案底下的所有訓練階段
        /// </summary>
        /// <param name="projectId">專案 ID</param>
        /// <returns>該專案底下的所有階段集合</returns>
        Task<IEnumerable<Stage>> GetStagesByProjectAsync(Guid projectId);

        /// <summary>
        /// 根據階段 ID 取得特定的階段詳情
        /// </summary>
        /// <param name="id">階段 ID</param>
        /// <returns>指定的階段物件；若不存在則回傳 null</returns>
        Task<Stage?> GetStageAsync(Guid id);

        /// <summary>
        /// 建立一個新的訓練階段
        /// </summary>
        /// <param name="stage">包含階段資訊的實體</param>
        /// <returns>建立完成並包含其識別碼的實體</returns>
        Task<Stage> CreateStageAsync(Stage stage);

        /// <summary>
        /// 更新現有的特定訓練階段
        /// </summary>
        /// <param name="stage">包含更新資訊的階段物件</param>
        Task UpdateStageAsync(Stage stage);

        /// <summary>
        /// 刪除特定的訓練階段
        /// </summary>
        /// <param name="id">欲刪除的階段 ID</param>
        Task DeleteStageAsync(Guid id);

        /// <summary>
        /// 重新排列專案中所有階段的排序
        /// </summary>
        /// <param name="projectId">專案 ID</param>
        /// <param name="updates">包含各個階段 ID 以及對應的新排序集合</param>
        Task UpdateStagesOrderAsync(Guid projectId, IEnumerable<StageOrderUpdateDto> updates);
    }

    /// <summary>
    /// 傳輸物件 (DTO)，用於批次更新各階段排序用
    /// </summary>
    public class StageOrderUpdateDto
    {
        /// <summary>
        /// 階段的唯一識別碼 ID
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// 該階段被指定的新順序索引 (OrderIdx)
        /// </summary>
        public int OrderIdx { get; set; }
    }
}
