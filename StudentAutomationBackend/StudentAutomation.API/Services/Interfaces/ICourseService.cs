using StudentAutomation.API.Dto;

namespace StudentAutomation.API.Services.Interfaces
{
    public interface ICourseService
    {
        Task<List<CourseDto>> GetAllCoursesAsync();
        Task<CourseDto?> GetCourseByIdAsync(Guid id);
        Task<CourseDto> CreateCourseAsync(CreateCourseDto createCourseDto);
        Task<CourseDto?> UpdateCourseAsync(Guid id, CreateCourseDto updateCourseDto);
        Task<bool> DeleteCourseAsync(Guid id);

        // ders-öğrenci ilişkisi 
        Task<bool> AddStudentToCourseAsync(Guid courseId, Guid studentId);
        Task<bool> RemoveStudentFromCourseAsync(Guid courseId, Guid studentId);
        Task<CourseWithStudentsDto?> GetCourseWithStudentsAsync(Guid courseId);

        // not ve devamsızlık işlemleri
        Task<bool> UpdateStudentGradeAsync(Guid courseId, Guid studentId, decimal grade);
        Task<bool> UpdateStudentAttendanceAsync(Guid courseId, Guid studentId, int attendance);
        Task<bool> UpdateStudentCommentAsync(Guid courseId, Guid studentId, string comment);

        // öğretmen için özel işlemler
        Task<List<CourseDto>> GetCoursesByTeacherAsync(Guid teacherId);
    }
}
