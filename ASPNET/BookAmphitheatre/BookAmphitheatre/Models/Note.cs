namespace BookAmphitheatre.Models
{
    public class Note
    {
        public int id { get; set; }
        public string? name { get; set; }
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
        public string? study { get; set; }
    }
}
