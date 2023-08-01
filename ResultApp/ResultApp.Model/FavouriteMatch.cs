using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResultApp.Model.Common;

namespace ResultApp.Model
{
    public class FavouriteMatch : Base, IFavouriteMatch
    {
        public Guid Id { get; set; }
        public Guid MatchId { get; set; }
        public Match Match { get; set; }

        public FavouriteMatch(Guid id, Guid matchId, Match match)
        {
            Id = id;
            MatchId = matchId;
            Match = match;
        }

        public FavouriteMatch(Guid id, Guid matchId, Match match, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            MatchId = matchId;
            Match = match;
            CreatedByUserId = createdByUserId;
        }

        public FavouriteMatch(Guid id, Guid matchId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            MatchId = matchId;
            CreatedByUserId = createdByUserId;
        }

        public FavouriteMatch(Guid id, Guid matchId, string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
        {
            Id = id;
            MatchId = matchId;
            UpdatedByUserId = updatedByUserId;
            DateUpdated = dateUpdated;
        }
    }
}
