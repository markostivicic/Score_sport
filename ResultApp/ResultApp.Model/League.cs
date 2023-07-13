using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class League : Base
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid SportId { get; set; }
        public Guid CountryId { get; set; }

    }
}
