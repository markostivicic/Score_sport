using ResultApp.WebApi.Models.Match;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.FavouriteMatch
{
    public class FavouriteMatchToReturnDto
    {
        public Guid Id { get; set; }
        public Guid MatchId { get; set; }
        public string UserId { get; set; }
        public MatchToReturnDto Match { get; set; }

        public FavouriteMatchToReturnDto(Guid id, Guid matchId, string userId, MatchToReturnDto match)
        {
            Id = id;
            MatchId = matchId;
            UserId = userId;
            Match = match;
        }
    }
}