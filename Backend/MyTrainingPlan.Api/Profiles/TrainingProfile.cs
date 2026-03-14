using AutoMapper;
using MyTrainingPlan.Api.Dtos;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Profiles
{
    /// <summary>
    /// 專案與階段的 AutoMapper 設定檔
    /// </summary>
    public class TrainingProfile : Profile
    {
        public TrainingProfile()
        {
            // Project 映射
            CreateMap<Project, ProjectResponse>();
            CreateMap<ProjectUpsertRequest, Project>();

            // Stage 映射
            CreateMap<Stage, StageResponse>();
            CreateMap<StageUpsertRequest, Stage>();
        }
    }
}
