using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }
      
        [HttpGet]
        [Authorize(Roles = "Admin,Teacher")] 
        public async Task<ActionResult<List<StudentDto>>> GetAllStudents()
        {
            var students = await _studentService.GetAllStudentsAsync();
            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDto>> GetStudent(Guid id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);

            if (student == null)
                return NotFound();

            return Ok(student);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Teacher")] 
        public async Task<ActionResult<StudentDto>> CreateStudent(CreateStudentDto createStudentDto)
        {
            var student = await _studentService.CreateStudentAsync(createStudentDto);
            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> UpdateStudent(Guid id, CreateStudentDto updateStudentDto)
        {
            var updatedStudent = await _studentService.UpdateStudentAsync(id, updateStudentDto);

            if (updatedStudent == null)
                return NotFound();

            return Ok(updatedStudent);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> DeleteStudent(Guid id)
        {
            var result = await _studentService.DeleteStudentAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("me/grades")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<List<StudentGradeDto>>> GetStudentGrades()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userGuid))
                return Unauthorized();

            // service katmanını kullanarak studentId'yi bul
            var studentId = await _studentService.GetStudentIdByUserIdAsync(userGuid);
            if (studentId == null)
                return NotFound("Öğrenci bulunamadı.");

            var grades = await _studentService.GetStudentGradesAsync(studentId.Value);
            return Ok(grades);
        }
    }
}
