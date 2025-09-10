using StudentAutomation.API.Data;
using StudentAutomation.API.Dto;
using StudentAutomation.API.Models;
using Microsoft.EntityFrameworkCore;
using StudentAutomation.API.Services.Interfaces;

namespace StudentAutomation.API.Services
{
    public class StudentService : IStudentService
    {
        private readonly ApplicationDbContext _context;

        public StudentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<StudentDto>> GetAllStudentsAsync()
        {
            var students = await _context.Students
                .Include(s => s.User) // user tablosu ile join işlemi
                .Select(s => new StudentDto
                {
                    Id = s.Id,
                    FirstName = s.User!.FirstName,
                    LastName = s.User.LastName,
                    Email = s.User.Email,
                    StudentNumber = s.StudentNumber,
                    Department = s.Department,
                    EnrollmentDate = s.EnrollmentDate
                })
                .ToListAsync();

            return students;
        }

        public async Task<StudentDto?> GetStudentByIdAsync(Guid id)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null || student.User == null)
                return null;

            return new StudentDto
            {
                Id = student.Id,
                FirstName = student.User.FirstName,
                LastName = student.User.LastName,
                Email = student.User.Email,
                StudentNumber = student.StudentNumber,
                Department = student.Department,
                EnrollmentDate = student.EnrollmentDate
            };
        }

        public async Task<StudentDto> CreateStudentAsync(CreateStudentDto createStudentDto)
        {
            //önce user oluştur
            var newUser = new User
            {
                FirstName = createStudentDto.FirstName,
                LastName = createStudentDto.LastName,
                Email = createStudentDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createStudentDto.Password),
                Role = "Student" // öğrenci oluşturduğumuz için rolü Student
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            //sonra Student oluştur ve User ile ilişkilendir
            var newStudent = new Student
            {
                UserId = newUser.Id,
                StudentNumber = createStudentDto.StudentNumber,
                Department = createStudentDto.Department,
                EnrollmentDate = DateTime.UtcNow
            };

            _context.Students.Add(newStudent);
            await _context.SaveChangesAsync();

            // oluşturulan student'ı döndür
            return new StudentDto
            {
                Id = newStudent.Id,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Email = newUser.Email,
                StudentNumber = newStudent.StudentNumber,
                Department = newStudent.Department,
                EnrollmentDate = newStudent.EnrollmentDate
            };
        }

        public async Task<StudentDto?> UpdateStudentAsync(Guid id, CreateStudentDto updateStudentDto)
        {
            // Student ve ilişkili User'ı bul
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null || student.User == null)
                return null;

            student.User.FirstName = updateStudentDto.FirstName;
            student.User.LastName = updateStudentDto.LastName;
            student.User.Email = updateStudentDto.Email;

            student.StudentNumber = updateStudentDto.StudentNumber;
            student.Department = updateStudentDto.Department;

            // şifre değiştirilmek istenirse (opsiyonel)
            if (!string.IsNullOrEmpty(updateStudentDto.Password))
            {
                student.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateStudentDto.Password);
            }

            await _context.SaveChangesAsync();

            return new StudentDto
            {
                Id = student.Id,
                FirstName = student.User.FirstName,
                LastName = student.User.LastName,
                Email = student.User.Email,
                StudentNumber = student.StudentNumber,
                Department = student.Department,
                EnrollmentDate = student.EnrollmentDate
            };
        }

        public async Task<bool> DeleteStudentAsync(Guid id)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
                return false;

            // önce Student kaydını sil
            _context.Students.Remove(student);

            // ilişkili User kaydını da sil
            if (student.User != null)
            {
                _context.Users.Remove(student.User);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<StudentGradeDto>> GetStudentGradesAsync(Guid studentId)
        {
            var grades = await _context.StudentCourses
                .Include(sc => sc.Course)
                .Include(sc => sc.Student)
                .ThenInclude(s => s.User)
                .Where(sc => sc.StudentId == studentId)
                .Select(sc => new StudentGradeDto
                {
                    CourseName = sc.Course.Name,
                    CourseCode = sc.Course.Code,
                    Grade = sc.Grade,
                    Attendance = sc.Attendance,
                    TeacherComment = sc.TeacherComment
                })
                .ToListAsync();

            return grades;
        }

        public async Task<Guid?> GetStudentIdByUserIdAsync(Guid userId)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.UserId == userId);

            return student?.Id;
        }
    }
}
