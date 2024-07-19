using BookAmphitheatre.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookAmphitheatre.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly BookAmphitheatreContext _dbContext;

        public ClassesController(BookAmphitheatreContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookAmphi>>> GetClasses()
        {
            if(_dbContext == null)
            {
                return NotFound();
            }
            return await _dbContext.Classes.ToListAsync();
        }
    }
}
