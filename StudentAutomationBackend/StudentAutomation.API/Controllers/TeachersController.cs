using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAutomation.API.Dto;
using StudentAutomation.API.Services.Interfaces;
using System.Security.Claims;

namespace StudentAutomation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TeachersController : ControllerBase
    {
        private readonly ITeacherService _teacherService;

        public TeachersController(ITeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<TeacherDto>>> GetAllTeachers()
        {
            var teachers = await _teacherService.GetAllTeachersAsync();
            return Ok(teachers);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TeacherDto>> GetTeacher(Guid id)
        {
            var teacher = await _teacherService.GetTeacherByIdAsync(id);

            if (teacher == null)
                return NotFound();

            return Ok(teacher);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TeacherDto>> CreateTeacher(CreateTeacherDto createTeacherDto)
        {
            var teacher = await _teacherService.CreateTeacherAsync(createTeacherDto);
            return CreatedAtAction(nameof(GetTeacher), new { id = teacher.Id }, teacher);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTeacher(Guid id, CreateTeacherDto updateTeacherDto)
        {
            var updatedTeacher = await _teacherService.UpdateTeacherAsync(id, updateTeacherDto);

            if (updatedTeacher == null)
                return NotFound();

            return Ok(updatedTeacher);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTeacher(Guid id)
        {
            var result = await _teacherService.DeleteTeacherAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("me/courses-with-students")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<List<CourseWithStudentsDto>>> GetTeacherCoursesWithStudents()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userGuid))
                return Unauthorized();

            // Service katmanını kullanarak teacherId'yi bul
            var teacherId = await _teacherService.GetTeacherIdByUserIdAsync(userGuid);
            if (teacherId == null)
                return NotFound("Öğretmen bulunamadı.");

            var courses = await _teacherService.GetTeacherCoursesWithStudentsAsync(teacherId.Value);
            return Ok(courses);
        }
    }
}
