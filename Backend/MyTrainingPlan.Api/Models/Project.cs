using System;
using System.Collections.Generic;

namespace MyTrainingPlan.Api.Models
{
    /// <summary>
    /// 定義訓練計畫的專案模型 (Project)
    /// </summary>
    public class Project
    {
        /// <summary>
        /// 專案唯一識別碼
        /// </summary>
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// 專案名稱 (例如："全身燃脂計畫")
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// 全域休息時播放的 YouTube 影片網址 (可選填)
        /// 若設定，每階段之間的休息將優先播放此影片
        /// </summary>
        public string? GlobalRestVideoUrl { get; set; }

        /// <summary>
        /// 專案建立時間 (以 UTC 紀錄)
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// 專案最後更新時間 (以 UTC 紀錄)
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// 導覽屬性 (Navigation Property)：
        /// 關聯到此專案底下的所有訓練階段 (Stages)
        /// </summary>
        public ICollection<Stage> Stages { get; set; } = new List<Stage>();
    }
}
