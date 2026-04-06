using AutoMapper;
using QuizApp.Api.Dto;
using QuizApp.Api.Models;

namespace QuizApp.Api.Profiles;

public sealed class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserProfileDto>()
            .ForMember(
                dest => dest.AuthProvider,
                opt => opt.MapFrom(src =>
                    !string.IsNullOrWhiteSpace(src.GoogleId)
                        ? AuthProvider.Google.ToString()
                        : !string.IsNullOrWhiteSpace(src.FacebookId)
                            ? AuthProvider.Facebook.ToString()
                            : AuthProvider.Guest.ToString()))
            .ForMember(dest => dest.Progress, opt => opt.Ignore());
    }
}
