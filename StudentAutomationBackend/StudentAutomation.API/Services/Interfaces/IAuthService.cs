using StudentAutomation.API.Dto;

namespace StudentAutomation.API.Services.Interfaces;

public interface IAuthService
{
    Task<bool> Register(RegisterDto registerDto);
    Task<LoginResponseDto?> Login(LoginDto loginDto);
}
