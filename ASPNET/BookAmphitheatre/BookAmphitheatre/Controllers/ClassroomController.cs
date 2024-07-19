using BookAmphitheatre.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace BookAmphitheatre.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassroomController : ControllerBase
    {
        private readonly ClassroomContext _classroomContext;
        public ClassroomController(ClassroomContext dbContext)
        {
            _classroomContext = dbContext;
        }

        [HttpGet]
        [Route("api/getClassrooms")]
        public async Task<ActionResult<List<Classroom>>> GetClassrooms()
        {
            var data = await _classroomContext.Classrooms.ToListAsync();
            return Ok(data);
        }

        [HttpPut("updateClassroom")]
        public async Task<IActionResult> UpdateClassroom([FromBody] Classroom updatedClassroom)
        {
            var existingClassroom = await _classroomContext.Classrooms.FindAsync(updatedClassroom.id);

            if (existingClassroom == null)
            {
                return NotFound("Car not found.");
            }

            existingClassroom.classroom_name = updatedClassroom.classroom_name;
            existingClassroom.chairRow = updatedClassroom.chairRow;
            existingClassroom.chairColumn = updatedClassroom.chairColumn;

            await _classroomContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("deleteClassroom")]
        public async Task<IActionResult> RemoveClassroom([FromBody] Classroom deletedClassroom)
        {
            var existingClassroom = await _classroomContext.Classrooms.FindAsync(deletedClassroom.id);

            if (existingClassroom == null)
            {
                return NotFound("Car not found.");
            }
            _classroomContext.Classrooms.Remove(existingClassroom);
            await _classroomContext.SaveChangesAsync();
            return Ok();
        }

        [Route("addClassroom")]
        [HttpPost]
        public async Task<IActionResult> AddClassroom([FromBody] Classroom classroom)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    await _classroomContext.Classrooms.AddAsync(classroom);
                    await _classroomContext.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
