using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Common
{
    public class ClubFilter
    {
        public string Name { get; set; }
        public Guid? LeagueId { get; set; }
        public Guid? SportId { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
