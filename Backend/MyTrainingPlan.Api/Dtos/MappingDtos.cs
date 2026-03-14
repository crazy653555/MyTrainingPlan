using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyTrainingPlan.Api.Dtos
{
    /// <summary>
    /// 專案回傳資料傳輸物件
    /// </summary>
    public class ProjectResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? GlobalRestVideoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<StageResponse> Stages { get; set; } = new();
    }

    /// <summary>
    /// 專案新增或更新請求物件
    /// </summary>
    public class ProjectUpsertRequest
    {
        [Required(ErrorMessage = "專案名稱為必填")]
        [StringLength(100, ErrorMessage = "專案名稱長度不能超過 100 字元")]
        public string Name { get; set; } = string.Empty;

        public string? GlobalRestVideoUrl { get; set; }
    }

    /// <summary>
    /// 階段回傳資料傳輸物件
    /// </summary>
    public class StageResponse
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string StageName { get; set; } = string.Empty;
        public string? YoutubeUrl { get; set; }
        public int PracticeSeconds { get; set; }
        public int RestSeconds { get; set; }
        public int StartSecond { get; set; }
        public int EndSecond { get; set; }
        public int OrderIdx { get; set; }
    }

    /// <summary>
    /// 階段新增或更新請求物件
    /// </summary>
    public class StageUpsertRequest
    {
        [Required(ErrorMessage = "階段名稱為必填")]
        [StringLength(100, ErrorMessage = "階段名稱長度不能超過 100 字元")]
        public string StageName { get; set; } = string.Empty;

        public string? YoutubeUrl { get; set; }
        public int PracticeSeconds { get; set; }
        public int RestSeconds { get; set; }
        public int StartSecond { get; set; }
        public int EndSecond { get; set; }
        
        /// <summary>
        /// 排序權重，若為 0 則代表加在最後
        /// </summary>
        public int OrderIdx { get; set; }
    }
}
