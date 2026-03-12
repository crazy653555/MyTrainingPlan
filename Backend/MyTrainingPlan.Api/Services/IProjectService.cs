using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Services
{
    /// <summary>
    /// 定義專案 (Project) 管理功能的業務邏輯介面
    /// </summary>
    public interface IProjectService
    {
        /// <summary>
        /// 取得所有專案的集合
        /// </summary>
        /// <returns>系統中所有的專案</returns>
        Task<IEnumerable<Project>> GetAllProjectsAsync();

        /// <summary>
        /// 根據 ID 取得特定的專案
        /// </summary>
        /// <param name="id">專案唯一識別碼</param>
        /// <returns>指定的專案對象；若找不到回傳 null</returns>
        Task<Project?> GetProjectAsync(Guid id);

        /// <summary>
        /// 根據 ID 取得專案，並同時載入關聯的所有階段 (Stages)
        /// </summary>
        /// <param name="id">專案唯一識別碼</param>
        /// <returns>夾帶階段資料的專案對象；若找不到回傳 null</returns>
        Task<Project?> GetProjectWithStagesAsync(Guid id);

        /// <summary>
        /// 建立新的專案
        /// </summary>
        /// <param name="project">要建立的專案資料</param>
        /// <returns>已成功建立並獲得新 ID 的專案</returns>
        Task<Project> CreateProjectAsync(Project project);

        /// <summary>
        /// 更新目前存在的專案內容
        /// </summary>
        /// <param name="project">夾帶更新內容的專案物件</param>
        Task UpdateProjectAsync(Project project);

        /// <summary>
        /// 刪除指定的專案與其關聯內容
        /// </summary>
        /// <param name="id">欲刪除的專案唯一識別碼</param>
        Task DeleteProjectAsync(Guid id);
    }
}
