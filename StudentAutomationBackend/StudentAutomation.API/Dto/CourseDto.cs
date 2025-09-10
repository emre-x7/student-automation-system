namespace StudentAutomation.API.Dto
{
    public class CourseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid TeacherId { get; set; }
        public string TeacherName { get; set; } = string.Empty;
    }

    public class CreateCourseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid TeacherId { get; set; }
    }

    public class AddStudentToCourseDto
    {
        public Guid StudentId { get; set; }
        public Guid CourseId { get; set; }
    }

    public class CourseWithStudentsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<CourseStudentDto> Students { get; set; } = new();
    }

    public class CourseStudentDto
    {
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
        public decimal? Grade { get; set; }
        public int? Attendance { get; set; }
        public string? TeacherComment { get; set; }
    }
}
