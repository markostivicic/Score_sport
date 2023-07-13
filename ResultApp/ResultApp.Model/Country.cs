using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class Country : Base
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
