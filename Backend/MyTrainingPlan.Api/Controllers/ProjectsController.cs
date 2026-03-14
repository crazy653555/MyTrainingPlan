using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyTrainingPlan.Api.Dtos;
using MyTrainingPlan.Api.Models;
using MyTrainingPlan.Api.Services;

namespace MyTrainingPlan.Api.Controllers
{
    /// <summary>
    /// 專案 (Project) 管理的 API 控制器
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IMapper _mapper;

        /// <summary>
        /// 初始化 <see cref="ProjectsController"/> 類別的新執行個體
        /// </summary>
        /// <param name="projectService">專案業務邏輯服務</param>
        /// <param name="mapper">AutoMapper 轉換器</param>
        public ProjectsController(IProjectService projectService, IMapper mapper)
        {
            _projectService = projectService;
            _mapper = mapper;
        }

        /// <summary>
        /// 取得所有專案的清單
        /// </summary>
        /// <returns>所有專案的陣列</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponse>>> GetProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            var response = _mapper.Map<IEnumerable<ProjectResponse>>(projects);
            return Ok(response);
        }

        /// <summary>
        /// 根據專案 ID 取得單一專案及其詳細階段資料
        /// </summary>
        /// <param name="id">專案的唯一識別碼</param>
        /// <returns>專案資訊；若找不到則回傳 404 NotFound</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectResponse>> GetProject(Guid id)
        {
            var project = await _projectService.GetProjectWithStagesAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            var response = _mapper.Map<ProjectResponse>(project);
            return Ok(response);
        }

        /// <summary>
        /// 建立新的專案
        /// </summary>
        /// <param name="request">要建立的專案內容</param>
        /// <returns>回傳 201 Created 狀態碼並附帶新建專案資訊</returns>
        [HttpPost]
        public async Task<ActionResult<ProjectResponse>> CreateProject(ProjectUpsertRequest request)
        {
            var project = _mapper.Map<Project>(request);
            var createdProject = await _projectService.CreateProjectAsync(project);
            var response = _mapper.Map<ProjectResponse>(createdProject);
            return CreatedAtAction(nameof(GetProject), new { id = response.Id }, response);
        }

        /// <summary>
        /// 更新現有的專案資訊
        /// </summary>
        /// <param name="id">欲更新的專案 ID</param>
        /// <param name="request">新的專案資料</param>
        /// <returns>成功則回傳 204 NoContent</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(Guid id, ProjectUpsertRequest request)
        {
            var existingProject = await _projectService.GetProjectAsync(id);
            if (existingProject == null)
            {
                return NotFound();
            }

            // 使用 AutoMapper 將 Request 的內容映射到已存在的 Entity
            _mapper.Map(request, existingProject);

            await _projectService.UpdateProjectAsync(existingProject);

            return NoContent();
        }

        /// <summary>
        /// 刪除指定的專案
        /// </summary>
        /// <param name="id">欲刪除的專案唯一識別碼</param>
        /// <returns>成功則回傳 204 NoContent</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var project = await _projectService.GetProjectAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            await _projectService.DeleteProjectAsync(id);
            return NoContent();
        }
    }
}
