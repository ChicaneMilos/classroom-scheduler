using BookAmphitheatre.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace BookAmphitheatre.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudyController : ControllerBase
    {
        private readonly StudyContext _studyContext;
        public StudyController(StudyContext dbContext)
        {
            _studyContext = dbContext;
        }

        [HttpGet]
        [Route("api/getStudies")]
        public async Task<ActionResult<List<Study>>> GetStudies()
        {
            var data = await _studyContext.Studies.ToListAsync();
            return Ok(data);
        }
    }
}
