using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Common
{
    public class Sorting
    {
        public string OrderBy { get; set; } = "Id";
        public string SortOrder { get; set; } = "ASC";

        public Sorting(string orderBy, string sortOrder)
        {
            OrderBy = orderBy;
            SortOrder = sortOrder;
        }
    }
}
