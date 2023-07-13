using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class FavouriteClub : Base
    {
        public Guid Id { get; set; }
        public Guid ClubId { get; set; }
        public Guid UserId { get; set; }
    }
}
