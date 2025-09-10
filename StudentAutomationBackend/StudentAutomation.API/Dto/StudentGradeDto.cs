namespace StudentAutomation.API.Dto
{
    public class StudentGradeDto
    {
        public string CourseName { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public decimal? Grade { get; set; }
        public int? Attendance { get; set; }
        public string? TeacherComment { get; set; }
    }
}
