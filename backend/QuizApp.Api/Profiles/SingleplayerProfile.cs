using AutoMapper;
using QuizApp.Api.Dto.Singleplayer;
using QuizApp.Api.Models;

namespace QuizApp.Api.Profiles;

public sealed class SingleplayerProfile : Profile
{
    public SingleplayerProfile()
    {
        CreateMap<Category, CategoryDto>();

        CreateMap<LevelQuestionDistribution, LevelQuestionDistributionDto>()
            .ConstructUsing(src => new LevelQuestionDistributionDto(src.Difficulty.ToString(), src.Count));

        CreateMap<Level, LevelDto>()
            .ForMember(dest => dest.QuestionDistributions, opt => opt.MapFrom(src => src.QuestionDistributions.OrderBy(distribution => distribution.Difficulty)))
            .ForMember(dest => dest.TotalQuestionCount, opt => opt.MapFrom(src => src.QuestionDistributions.Sum(distribution => distribution.Count)))
            .ForMember(dest => dest.IsUnlocked, opt => opt.Ignore());

        CreateMap<SingleplayerAnswer, SingleplayerAnswerDto>();

        CreateMap<SingleplayerQuestion, SingleplayerQuestionDto>()
            .ForCtorParam(nameof(SingleplayerQuestionDto.Id), opt => opt.MapFrom(src => src.Id))
            .ForCtorParam(nameof(SingleplayerQuestionDto.Text), opt => opt.MapFrom(src => src.Text))
            .ForCtorParam(nameof(SingleplayerQuestionDto.Answers), opt => opt.MapFrom(src => src.Answers.OrderBy(answer => answer.Id)));
    }
}
