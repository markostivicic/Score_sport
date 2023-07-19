using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.FavouriteClub
{
    public class FavouriteClubToCreateAndUpdate
    {
        public Guid? ClubId { get; set; }
        public Guid? UserId { get; set; }

        public FavouriteClubToCreateAndUpdate(Guid? clubId, Guid? userId)
        {
            ClubId = clubId;
            UserId = userId;
        }
    }
}