using Microsoft.EntityFrameworkCore;

namespace BookAmphitheatre.Models
{
    public class BookAmphitheatreContext : DbContext
    {
        public BookAmphitheatreContext(DbContextOptions<BookAmphitheatreContext> options) : base(options)
        {

        }

        public DbSet<BookAmphi> Classes { get; set; }
    }
}
