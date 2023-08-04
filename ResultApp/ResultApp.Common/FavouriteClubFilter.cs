using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Common
{
    public class FavouriteClubFilter
    {
        public Guid? ClubId { get; set; }
        public bool? IsActive { get; set; } = null;
    }
}
