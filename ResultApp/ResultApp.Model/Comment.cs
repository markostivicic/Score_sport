using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class Comment : Base
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public Guid MatchId { get; set; }
    }
}
