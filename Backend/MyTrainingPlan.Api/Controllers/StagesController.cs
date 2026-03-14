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
    /// 訓練階段 (Stage) 管理的 API 控制器
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class StagesController : ControllerBase
    {
        private readonly IStageService _stageService;
        private readonly IMapper _mapper;

        /// <summary>
        /// 初始化 <see cref="StagesController"/> 類別的新執行個體
        /// </summary>
        /// <param name="stageService">訓練階段業務邏輯服務</param>
        /// <param name="mapper">AutoMapper 轉換器</param>
        public StagesController(IStageService stageService, IMapper mapper)
        {
            _stageService = stageService;
            _mapper = mapper;
        }

        /// <summary>
        /// 取得某一個專案底下所有的訓練階段清單
        /// </summary>
        /// <param name="projectId">專案 ID</param>
        /// <returns>該專案所有的訓練階段，並依指定順序回傳</returns>
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<StageResponse>>> GetStagesByProject(Guid projectId)
        {
            var stages = await _stageService.GetStagesByProjectAsync(projectId);
            var response = _mapper.Map<IEnumerable<StageResponse>>(stages);
            return Ok(response);
        }

        /// <summary>
        /// 取得單一訓練階段詳細資料
        /// </summary>
        /// <param name="id">階段 ID</param>
        /// <returns>對應的訓練階段資料</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<StageResponse>> GetStage(Guid id)
        {
            var stage = await _stageService.GetStageAsync(id);
            if (stage == null)
            {
                return NotFound();
            }
            var response = _mapper.Map<StageResponse>(stage);
            return Ok(response);
        }

        /// <summary>
        /// 建立新的訓練階段
        /// </summary>
        /// <param name="request">新階段的內容</param>
        /// <returns>回傳 201 Created 並附上新建的階段資料</returns>
        [HttpPost]
        public async Task<ActionResult<StageResponse>> CreateStage(StageUpsertRequest request)
        {
            var stage = _mapper.Map<Stage>(request);
            var createdStage = await _stageService.CreateStageAsync(stage);
            var response = _mapper.Map<StageResponse>(createdStage);
            return CreatedAtAction(nameof(GetStage), new { id = response.Id }, response);
        }

        /// <summary>
        /// 更新指定的訓練階段細節資料
        /// </summary>
        /// <param name="id">階段 ID</param>
        /// <param name="request">包含更新資訊的階段物件</param>
        /// <returns>成功更新則回傳 204 NoContent</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStage(Guid id, StageUpsertRequest request)
        {
            var existingStage = await _stageService.GetStageAsync(id);
            if (existingStage == null)
            {
                return NotFound();
            }

            // 使用 AutoMapper 將 Request 的內容映射到已存在的 Entity
            _mapper.Map(request, existingStage);

            await _stageService.UpdateStageAsync(existingStage);

            return NoContent();
        }

        /// <summary>
        /// 刪除某個特定的訓練階段
        /// </summary>
        /// <param name="id">階段 ID</param>
        /// <returns>成功刪除後回傳 204 NoContent</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStage(Guid id)
        {
            var stage = await _stageService.GetStageAsync(id);
            if (stage == null)
            {
                return NotFound();
            }

            await _stageService.DeleteStageAsync(id);
            return NoContent();
        }

        /// <summary>
        /// 更新專案底下各個訓練階段的排列順序
        /// </summary>
        /// <param name="projectId">所屬專案 ID</param>
        /// <param name="updates">包含各階段對應其新順序編號的陣列清單</param>
        /// <returns>更新完成回傳 204 NoContent</returns>
        [HttpPut("project/{projectId}/reorder")]
        public async Task<IActionResult> UpdateStagesOrder(Guid projectId, [FromBody] IEnumerable<StageOrderUpdateDto> updates)
        {
            await _stageService.UpdateStagesOrderAsync(projectId, updates);
            return NoContent();
        }
    }
}
