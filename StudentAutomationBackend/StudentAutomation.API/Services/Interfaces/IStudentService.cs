using StudentAutomation.API.Dto;

namespace StudentAutomation.API.Services.Interfaces
{
    public interface IStudentService
    {
        Task<List<StudentDto>> GetAllStudentsAsync();
        Task<StudentDto?> GetStudentByIdAsync(Guid id);
        Task<StudentDto> CreateStudentAsync(CreateStudentDto createStudentDto);
        Task<StudentDto?> UpdateStudentAsync(Guid id, CreateStudentDto updateStudentDto);
        Task<bool> DeleteStudentAsync(Guid id);
        Task<List<StudentGradeDto>> GetStudentGradesAsync(Guid studentId);
        Task<Guid?> GetStudentIdByUserIdAsync(Guid userId);
    }
}
