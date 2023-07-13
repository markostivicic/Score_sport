using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class Match : Base
    {
        public Guid Id { get; set; }
        public int HomeScore { get; set; }
        public int AwayScore { get; set; }
        public DateTime Time { get; set; }
        public Guid LocationId { get; set; }
        public Guid ClubHomeId { get; set; }
        public Guid ClubAwayId { get; set; }
    }
}
