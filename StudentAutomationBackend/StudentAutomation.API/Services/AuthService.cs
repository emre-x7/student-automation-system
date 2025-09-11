using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using StudentAutomation.API.Data;
using StudentAutomation.API.Dto;
using StudentAutomation.API.Models;
using StudentAutomation.API.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudentAutomation.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        // Dependency Injection ile context ve configuration alıyoruz
        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<bool> Register(RegisterDto registerDto)
        {
            //aynı email'de kullanıcı var mı kontrol et
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

            if (existingUser != null)
                return false;

            //yeni kullanıcı oluştur ve şifreyi hashle
            var newUser = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = registerDto.Role
            };

            //kullanıcıyı veritabanına ekle
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<LoginResponseDto?> Login(LoginDto loginDto)
        {
            //email'e göre kullanıcıyı bul
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
                return null;

            //şifreyi doğrula
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return null;

            //JWT Token oluştur
            var token = CreateToken(user);

            //Login response'u döndür
            return new LoginResponseDto
            {
                token = token,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                role = user.Role
            };
        }

        private string CreateToken(User user)
        {
            // JWT için claims oluştur
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("UserId", user.Id.ToString())
        };

            if (user.Role == "Teacher")
            {
                var teacher = _context.Teachers.FirstOrDefault(t => t.UserId == user.Id);
                if (teacher != null)
                {
                    claims.Add(new Claim("TeacherId", teacher.Id.ToString()));
                }
            }

            if (user.Role == "Student")
            {
                var student = _context.Students.FirstOrDefault(s => s.UserId == user.Id);
                if (student != null)
                {
                    claims.Add(new Claim("StudentId", student.Id.ToString()));
                }
            }

            // JWT ayarlarını configurationdan al
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Anahtarı yapılandırılmamış.")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // token descriptor oluştur
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(2),
                SigningCredentials = creds,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            // token handler ve token oluştur
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
