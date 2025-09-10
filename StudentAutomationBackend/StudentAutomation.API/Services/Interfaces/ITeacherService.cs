using StudentAutomation.API.Dto;

namespace StudentAutomation.API.Services.Interfaces
{
    public interface ITeacherService
    {
        Task<List<TeacherDto>> GetAllTeachersAsync();
        Task<TeacherDto?> GetTeacherByIdAsync(Guid id);
        Task<TeacherDto> CreateTeacherAsync(CreateTeacherDto createTeacherDto);
        Task<TeacherDto?> UpdateTeacherAsync(Guid id, CreateTeacherDto updateTeacherDto);
        Task<bool> DeleteTeacherAsync(Guid id);
        Task<List<CourseWithStudentsDto>> GetTeacherCoursesWithStudentsAsync(Guid teacherId);
        Task<Guid?> GetTeacherIdByUserIdAsync(Guid userId);
    }
}
