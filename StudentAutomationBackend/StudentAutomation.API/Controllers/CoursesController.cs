using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentAutomation.API.Dto;
using StudentAutomation.API.Services.Interfaces;

namespace StudentAutomation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CourseDto>>> GetAllCourses()
        {
            var courses = await _courseService.GetAllCoursesAsync();
            return Ok(courses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(Guid id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);

            if (course == null)
                return NotFound();

            return Ok(course);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CourseDto>> CreateCourse(CreateCourseDto createCourseDto)
        {
            var course = await _courseService.CreateCourseAsync(createCourseDto);
            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCourse(Guid id, CreateCourseDto updateCourseDto)
        {
            var updatedCourse = await _courseService.UpdateCourseAsync(id, updateCourseDto);

            if (updatedCourse == null)
                return NotFound();

            return Ok(updatedCourse);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            var result = await _courseService.DeleteCourseAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("teacher/{teacherId}")]
        [Authorize(Roles = "Admin,Teacher")] // admin ve kendi derslerini görmek isteyen Teacher
        public async Task<ActionResult<List<CourseDto>>> GetCoursesByTeacher(Guid teacherId)
        {
            var courses = await _courseService.GetCoursesByTeacherAsync(teacherId);
            return Ok(courses);
        }

        [HttpGet("{courseId}/students")]
        [Authorize(Roles = "Admin,Teacher")] // admin ve dersin öğretmeni
        public async Task<ActionResult<CourseWithStudentsDto>> GetCourseWithStudents(Guid courseId)
        {
            var course = await _courseService.GetCourseWithStudentsAsync(courseId);

            if (course == null)
                return NotFound();

            return Ok(course);
        }

        [HttpPost("{courseId}/students")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> AddStudentToCourse(Guid courseId, [FromBody] Guid studentId)
        {
            var result = await _courseService.AddStudentToCourseAsync(courseId, studentId);

            if (!result)
                return BadRequest("Öğrenci bu derse zaten kayıtlı veya geçersiz veri!");

            return Ok();
        }

        [HttpDelete("{courseId}/students/{studentId}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> RemoveStudentFromCourse(Guid courseId, Guid studentId)
        {
            var result = await _courseService.RemoveStudentFromCourseAsync(courseId, studentId);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPut("{courseId}/students/{studentId}/grade")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> UpdateStudentGrade(Guid courseId, Guid studentId, [FromBody] decimal grade)
        {
            var result = await _courseService.UpdateStudentGradeAsync(courseId, studentId, grade);

            if (!result)
                return NotFound();

            return Ok();
        }

        [HttpPut("{courseId}/students/{studentId}/attendance")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> UpdateStudentAttendance(Guid courseId, Guid studentId, [FromBody] int attendance)
        {
            var result = await _courseService.UpdateStudentAttendanceAsync(courseId, studentId, attendance);

            if (!result)
                return NotFound();

            return Ok();
        }

        [HttpPut("{courseId}/students/{studentId}/comment")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> UpdateStudentComment(Guid courseId, Guid studentId, [FromBody] string comment)
        {
            var result = await _courseService.UpdateStudentCommentAsync(courseId, studentId, comment);

            if (!result)
                return NotFound();

            return Ok();
        }
    }
}
