using AutoMapper;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;

namespace QuizApp.Api.Profiles;

public sealed class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserProfileDto>();
    }
}
