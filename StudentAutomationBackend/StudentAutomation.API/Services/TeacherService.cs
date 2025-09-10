using Microsoft.EntityFrameworkCore;
using StudentAutomation.API.Data;
using StudentAutomation.API.Dto;
using StudentAutomation.API.Models;
using StudentAutomation.API.Services.Interfaces;

namespace StudentAutomation.API.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly ApplicationDbContext _context;

        public TeacherService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TeacherDto>> GetAllTeachersAsync()
        {
            var teachers = await _context.Teachers
                .Include(t => t.User)
                .Select(t => new TeacherDto
                {
                    Id = t.Id,
                    FirstName = t.User!.FirstName,
                    LastName = t.User.LastName,
                    Email = t.User.Email,
                    Branch = t.Branch
                })
                .ToListAsync();

            return teachers;
        }

        public async Task<TeacherDto?> GetTeacherByIdAsync(Guid id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher == null || teacher.User == null)
                return null;

            return new TeacherDto
            {
                Id = teacher.Id,
                FirstName = teacher.User.FirstName,
                LastName = teacher.User.LastName,
                Email = teacher.User.Email,
                Branch = teacher.Branch
            };
        }

        public async Task<TeacherDto> CreateTeacherAsync(CreateTeacherDto createTeacherDto)
        {
            var newUser = new User
            {
                FirstName = createTeacherDto.FirstName,
                LastName = createTeacherDto.LastName,
                Email = createTeacherDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createTeacherDto.Password),
                Role = "Teacher"
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var newTeacher = new Teacher
            {
                UserId = newUser.Id,
                Branch = createTeacherDto.Branch
            };

            _context.Teachers.Add(newTeacher);
            await _context.SaveChangesAsync();

            return new TeacherDto
            {
                Id = newTeacher.Id,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Email = newUser.Email,
                Branch = newTeacher.Branch
            };
        }

        public async Task<TeacherDto?> UpdateTeacherAsync(Guid id, CreateTeacherDto updateTeacherDto)
        {
            var teacher = await _context.Teachers
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher == null || teacher.User == null)
                return null;

            teacher.User.FirstName = updateTeacherDto.FirstName;
            teacher.User.LastName = updateTeacherDto.LastName;
            teacher.User.Email = updateTeacherDto.Email;
            teacher.Branch = updateTeacherDto.Branch;

            if (!string.IsNullOrEmpty(updateTeacherDto.Password))
            {
                teacher.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateTeacherDto.Password);
            }

            await _context.SaveChangesAsync();

            return new TeacherDto
            {
                Id = teacher.Id,
                FirstName = teacher.User.FirstName,
                LastName = teacher.User.LastName,
                Email = teacher.User.Email,
                Branch = teacher.Branch
            };
        }

        public async Task<bool> DeleteTeacherAsync(Guid id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher == null)
                return false;

            _context.Teachers.Remove(teacher);

            if (teacher.User != null)
            {
                _context.Users.Remove(teacher.User);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<CourseWithStudentsDto>> GetTeacherCoursesWithStudentsAsync(Guid teacherId)
        {
            var courses = await _context.Courses
                .Include(c => c.StudentCourses)
                .ThenInclude(sc => sc.Student)
                .ThenInclude(s => s.User)
                .Where(c => c.TeacherId == teacherId)
                .Select(c => new CourseWithStudentsDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Code = c.Code,
                    Description = c.Description,
                    Students = c.StudentCourses.Select(sc => new CourseStudentDto
                    {
                        StudentId = sc.StudentId,
                        StudentName = $"{sc.Student.User.FirstName} {sc.Student.User.LastName}",
                        StudentNumber = sc.Student.StudentNumber,
                        Grade = sc.Grade,
                        Attendance = sc.Attendance,
                        TeacherComment = sc.TeacherComment
                    }).ToList()
                })
                .ToListAsync();

            return courses;
        }

        public async Task<Guid?> GetTeacherIdByUserIdAsync(Guid userId)
        {
            var teacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.UserId == userId);

            return teacher?.Id;
        }
    }
}
