namespace StudentAutomation.API.Models
{
    public class Course
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty; // Ders kodu (Örn: MAT101)
        public string? Description { get; set; }

        // her dersin bir öğretmeni olur (Teacher ile ilişki)
        public Guid TeacherId { get; set; }
        public Teacher? Teacher { get; set; }

        // bir derse kayıtlı öğrenciler (Many-to-Many ilişki için junction table)
        public ICollection<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();
        public string Status { get; set; } = "Planlandı";

    }

    public class StudentCourse
    {
        public Guid Id { get; set; }

        // Öğrenci ilişkisi
        public Guid StudentId { get; set; }
        public Student? Student { get; set; }

        // Ders ilişkisi
        public Guid CourseId { get; set; }
        public Course? Course { get; set; }

        // Not ve devamsızlık bilgileri
        public decimal? Grade { get; set; } // Not (100 üzerinden)
        public int? Attendance { get; set; } // Devamsızlık (gün sayısı)
        public string? TeacherComment { get; set; } 
    }
}
