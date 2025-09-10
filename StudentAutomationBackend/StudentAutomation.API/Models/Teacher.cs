namespace StudentAutomation.API.Models
{
    public class Teacher
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Branch { get; set; } = string.Empty;

        // Navigation Property - User tablosu ile ilişki
        public User? User { get; set; }
    }
}
