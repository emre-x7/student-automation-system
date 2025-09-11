namespace StudentAutomation.API.Dto
{
    public class LoginResponseDto
    {
        public string token { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string firstName { get; set; } = string.Empty;
        public string lastName { get; set; } = string.Empty;
        public string role { get; set; } = string.Empty;
    }
}
