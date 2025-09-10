namespace StudentAutomation.API.Models
{
    public class Student
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string StudentNumber { get; set; } = string.Empty;
        public string? Department { get; set; }
        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;

        // Navigation Property - user tablosu ile ilişki
        public User? User { get; set; }
    }
}
