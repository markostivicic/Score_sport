using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.FavouriteMatch
{
    public class FavouriteMatchToCreateAndUpdate
    {
        public Guid? MatchId { get; set; }
        public Guid? UserId { get; set; }

        public FavouriteMatchToCreateAndUpdate(Guid? matchId, Guid? userId)
        {
            MatchId = matchId;
            UserId = userId;
        }
    }
}