using System;

namespace MyTrainingPlan.Api.Models
{
    /// <summary>
    /// 定義訓練階段的模型 (Stage)
    /// 每個專案包含多個階段，對應不同的訓練動作與影片
    /// </summary>
    public class Stage
    {
        /// <summary>
        /// 階段的唯一識別碼
        /// </summary>
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// 關聯所屬專案的識別碼
        /// </summary>
        public Guid ProjectId { get; set; }

        /// <summary>
        /// 訓練階段的名稱 (例如："波比跳"、"伏地挺身")
        /// </summary>
        public string StageName { get; set; } = string.Empty;

        /// <summary>
        /// 該訓練階段對應播放的 YouTube 影片網址
        /// </summary>
        public string? YoutubeUrl { get; set; }

        /// <summary>
        /// 本階段的訓練時間長度 (以秒為單位)
        /// </summary>
        public int PracticeSeconds { get; set; }

        /// <summary>
        /// 本階段訓練結束後的休息時間 (以秒為單位)
        /// </summary>
        public int RestSeconds { get; set; }

        /// <summary>
        /// 影片開始播放的秒數
        /// </summary>
        public int StartSecond { get; set; }

        /// <summary>
        /// 影片結束播放的秒數 (可選填，若無填則播放至底)
        /// </summary>
        public int? EndSecond { get; set; }

        /// <summary>
        /// 階段在所屬專案中的排序索引 (越小排越前面)
        /// </summary>
        public int OrderIdx { get; set; }

        /// <summary>
        /// 導覽屬性 (Navigation Property)：
        /// 參照到所屬的專案實體
        /// </summary>
        public Project? Project { get; set; }
    }
}
