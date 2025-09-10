using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentAutomation.API.Dto;
using StudentAutomation.API.Services.Interfaces;

namespace StudentAutomation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (registerDto.Role != "Admin" && registerDto.Role != "Teacher" && registerDto.Role != "Student")
                return BadRequest("Geçersiz rol. İzin verilen roller: Admin, Teacher, Student");

            // AuthService'i kullanarak kayıt işlemi
            var result = await _authService.Register(registerDto);

            if (!result)
                return BadRequest("Bu e-postaya sahip kullanıcı zaten var.");

            return Ok("Kullanıcı başarıyla kaydedildi.");
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // AuthService'i kullanarak giriş işlemi
            var loginResult = await _authService.Login(loginDto);

            if (loginResult == null)
                return Unauthorized("Geçersiz e-posta veya şifre.");

            return Ok(loginResult);
        }

        [HttpGet("admin-test")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminTest()
        {
            return Ok("Sadece Adminlere özel bir mesajdır.");
        }
    }
}
