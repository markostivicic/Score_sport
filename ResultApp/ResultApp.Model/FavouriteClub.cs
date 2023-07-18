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

        public FavouriteClub(Guid id, Guid clubId) 
        {
            Id = id;
            ClubId = clubId;
        }
        public FavouriteClub(Guid id, Guid clubId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            ClubId = clubId;
        }

        public FavouriteClub(Guid id, Guid clubId, string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
        {
            Id = id;
            ClubId = clubId;
        }


    }
}
