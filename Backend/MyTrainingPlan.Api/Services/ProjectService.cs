using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;
using MyTrainingPlan.Api.Repositories;

namespace MyTrainingPlan.Api.Services
{
    /// <summary>
    /// 實作 IProjectService 的專案業務邏輯服務層
    /// 負責處理與計畫專案相關的各項商業邏輯，並串接資料存取庫
    /// </summary>
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;

        /// <summary>
        /// 初始化 <see cref="ProjectService"/> 類別的新執行個體
        /// </summary>
        /// <param name="projectRepository">注入專案資料存取庫</param>
        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        /// <summary>
        /// 取得所有專案的集合
        /// </summary>
        public async Task<IEnumerable<Project>> GetAllProjectsAsync()
        {
            return await _projectRepository.GetAllAsync();
        }

        /// <summary>
        /// 根據 ID 取得特定的專案
        /// </summary>
        public async Task<Project?> GetProjectAsync(Guid id)
        {
            return await _projectRepository.GetByIdAsync(id);
        }

        /// <summary>
        /// 根據 ID 取得專案，並同時載入關聯的所有階段 (Stages)
        /// </summary>
        public async Task<Project?> GetProjectWithStagesAsync(Guid id)
        {
            return await _projectRepository.GetProjectWithStagesAsync(id);
        }

        /// <summary>
        /// 建立新的專案，自動產生 ID 與更新時間記錄
        /// </summary>
        public async Task<Project> CreateProjectAsync(Project project)
        {
            project.Id = Guid.NewGuid();
            project.CreatedAt = DateTime.UtcNow;
            project.UpdatedAt = DateTime.UtcNow;

            await _projectRepository.AddAsync(project);
            await _projectRepository.SaveChangesAsync();
            return project;
        }

        /// <summary>
        /// 更新目前存在的專案內容，自動更新 UpdatedAt
        /// </summary>
        public async Task UpdateProjectAsync(Project project)
        {
            project.UpdatedAt = DateTime.UtcNow;
            await _projectRepository.UpdateAsync(project);
            await _projectRepository.SaveChangesAsync();
        }

        /// <summary>
        /// 刪除指定的專案與其關聯內容
        /// </summary>
        public async Task DeleteProjectAsync(Guid id)
        {
            await _projectRepository.DeleteByIdAsync(id);
            await _projectRepository.SaveChangesAsync();
        }
    }
}
