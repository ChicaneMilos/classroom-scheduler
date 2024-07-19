using Microsoft.EntityFrameworkCore;

namespace BookAmphitheatre.Models
{
    public class StudyContext : DbContext
    {
        public StudyContext(DbContextOptions<StudyContext> options) : base(options)
        {

        }

        public DbSet<Study> Studies { get; set; }
    }
}
