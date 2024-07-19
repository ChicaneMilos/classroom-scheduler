using Microsoft.EntityFrameworkCore;

namespace BookAmphitheatre.Models
{
    public class ClassroomContext : DbContext
    {
        public ClassroomContext(DbContextOptions<ClassroomContext> options) : base(options)
        {

        }

        public DbSet<Classroom> Classrooms{ get; set; }
    }
}
