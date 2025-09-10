using Microsoft.EntityFrameworkCore;
using StudentAutomation.API.Data;
using StudentAutomation.API.Dto;
using StudentAutomation.API.Models;
using StudentAutomation.API.Services.Interfaces;

namespace StudentAutomation.API.Services
{
    public class CourseService : ICourseService
    {
        private readonly ApplicationDbContext _context;

        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CourseDto>> GetAllCoursesAsync()
        {
            var courses = await _context.Courses
                .Include(c => c.Teacher)
                .ThenInclude(t => t.User)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Code = c.Code,
                    Description = c.Description,
                    TeacherId = c.TeacherId,
                    TeacherName = $"{c.Teacher!.User!.FirstName} {c.Teacher.User.LastName}"
                })
                .ToListAsync();

            return courses;
        }

        public async Task<CourseDto?> GetCourseByIdAsync(Guid id)
        {
            var course = await _context.Courses
                .Include(c => c.Teacher)
                .ThenInclude(t => t.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null || course.Teacher?.User == null)
                return null;

            return new CourseDto
            {
                Id = course.Id,
                Name = course.Name,
                Code = course.Code,
                Description = course.Description,
                TeacherId = course.TeacherId,
                TeacherName = $"{course.Teacher.User.FirstName} {course.Teacher.User.LastName}"
            };
        }

        public async Task<CourseDto> CreateCourseAsync(CreateCourseDto createCourseDto)
        {
            var newCourse = new Course
            {
                Name = createCourseDto.Name,
                Code = createCourseDto.Code,
                Description = createCourseDto.Description,
                TeacherId = createCourseDto.TeacherId
            };

            _context.Courses.Add(newCourse);
            await _context.SaveChangesAsync();

            // oluşturulan kursu tam bilgileriyle getir
            return await GetCourseByIdAsync(newCourse.Id) ?? throw new Exception("Kurs oluşturma başarısız oldu.");
        }

        public async Task<CourseDto?> UpdateCourseAsync(Guid id, CreateCourseDto updateCourseDto)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return null;

            course.Name = updateCourseDto.Name;
            course.Code = updateCourseDto.Code;
            course.Description = updateCourseDto.Description;
            course.TeacherId = updateCourseDto.TeacherId;

            await _context.SaveChangesAsync();
            return await GetCourseByIdAsync(id);
        }

        public async Task<bool> DeleteCourseAsync(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddStudentToCourseAsync(Guid courseId, Guid studentId)
        {
            // öğrencinin zaten bu derste olup olmadığını kontrol et
            var existingRelation = await _context.StudentCourses
                .FirstOrDefaultAsync(sc => sc.CourseId == courseId && sc.StudentId == studentId);

            if (existingRelation != null)
                return false;

            var studentCourse = new StudentCourse
            {
                StudentId = studentId,
                CourseId = courseId
            };

            _context.StudentCourses.Add(studentCourse);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveStudentFromCourseAsync(Guid courseId, Guid studentId)
        {
            var relation = await _context.StudentCourses
                .FirstOrDefaultAsync(sc => sc.CourseId == courseId && sc.StudentId == studentId);

            if (relation == null)
                return false;

            _context.StudentCourses.Remove(relation);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CourseWithStudentsDto?> GetCourseWithStudentsAsync(Guid courseId)
        {
            var course = await _context.Courses
                .Include(c => c.StudentCourses)
                .ThenInclude(sc => sc.Student)
                .ThenInclude(s => s.User)
                .FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null)
                return null;

            return new CourseWithStudentsDto
            {
                Id = course.Id,
                Name = course.Name,
                Code = course.Code,
                Description = course.Description,
                Students = course.StudentCourses.Select(sc => new CourseStudentDto
                {
                    StudentId = sc.StudentId,
                    StudentName = $"{sc.Student!.User!.FirstName} {sc.Student.User.LastName}",
                    StudentNumber = sc.Student.StudentNumber,
                    Grade = sc.Grade,
                    Attendance = sc.Attendance,
                    TeacherComment = sc.TeacherComment
                }).ToList()
            };
        }

        public async Task<bool> UpdateStudentGradeAsync(Guid courseId, Guid studentId, decimal grade)
        {
            var relation = await _context.StudentCourses
                .FirstOrDefaultAsync(sc => sc.CourseId == courseId && sc.StudentId == studentId);

            if (relation == null)
                return false;

            relation.Grade = grade;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateStudentAttendanceAsync(Guid courseId, Guid studentId, int attendance)
        {
            var relation = await _context.StudentCourses
                .FirstOrDefaultAsync(sc => sc.CourseId == courseId && sc.StudentId == studentId);

            if (relation == null)
                return false;

            relation.Attendance = attendance;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateStudentCommentAsync(Guid courseId, Guid studentId, string comment)
        {
            var relation = await _context.StudentCourses
                .FirstOrDefaultAsync(sc => sc.CourseId == courseId && sc.StudentId == studentId);

            if (relation == null)
                return false;

            relation.TeacherComment = comment;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<CourseDto>> GetCoursesByTeacherAsync(Guid teacherId)
        {
            var courses = await _context.Courses
                .Include(c => c.Teacher)
                .ThenInclude(t => t.User)
                .Where(c => c.TeacherId == teacherId)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Code = c.Code,
                    Description = c.Description,
                    TeacherId = c.TeacherId,
                    TeacherName = $"{c.Teacher!.User!.FirstName} {c.Teacher.User.LastName}"
                })
                .ToListAsync();

            return courses;
        }
    }
}
