using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Common
{
    public class FavouriteClubFilter
    {
        public string UserId { get; set; }
        public bool IsActive { get; set; }

        public FavouriteClubFilter(string userId, bool isActive)
        {
            UserId = userId;
            IsActive = isActive;
        }
    }
}
