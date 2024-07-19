using BookAmphitheatre.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace BookAmphitheatre.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly NoteContext _noteContext;

        public NoteController(NoteContext dbContext)
        {
            _noteContext = dbContext;
        }

        [Route("api/addNote")]
        [HttpPost]
        public async Task<IActionResult> AddNote([FromBody] Note note)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    Debug.WriteLine(note.name);
                    Debug.WriteLine(note.startTime);
                    Debug.WriteLine(note.endTime);
                    Debug.WriteLine(note.study);

                    await _noteContext.Notes.AddAsync(note);
                    await _noteContext.SaveChangesAsync();

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


        [HttpGet]
        [Route("api/getAllNote")]
        public async Task<ActionResult<List<Note>>> GetAllNote()
        {
            var data = await _noteContext.Notes.ToListAsync();
            return Ok(data);
        }

        [HttpGet("getNotesByDate")]
        public async Task<ActionResult<List<Note>>> GetNotesByDate(string startDate)
        {
            if (DateTime.TryParse(startDate, out DateTime parsedStartDate))
            {
                var data = await _noteContext.Notes
                                         .Where(g => g.startTime.Date == parsedStartDate.Date)
                                         .ToListAsync();
                if (data == null || data.Count == 0)
                    return NotFound("No cars found for the specified start date.");

                return Ok(data);
            }
            else
            {
                return BadRequest("Invalid date format.");
            }
        }

        [HttpPut("updateNote")]
        public async Task<IActionResult> UpdateNote([FromBody] Note updatedNote)
        {
            var existingNote = await _noteContext.Notes.FindAsync(updatedNote.id);

            if (existingNote == null)
            {
                return NotFound("Note not found.");
            }

            existingNote.name = updatedNote.name;
            existingNote.startTime = updatedNote.startTime;
            existingNote.endTime = updatedNote.endTime;
            existingNote.study = updatedNote.study;

            await _noteContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("deleteNote")]
        public async Task<IActionResult> RemoveNote([FromBody] Note deletedNote)
        {
            var existingNote = await _noteContext.Notes.FindAsync(deletedNote.id);

            if (existingNote == null)
            {
                return NotFound("Car not found.");
            }
            _noteContext.Notes.Remove(existingNote);
            await _noteContext.SaveChangesAsync();
            return Ok();
        }
    }
}
