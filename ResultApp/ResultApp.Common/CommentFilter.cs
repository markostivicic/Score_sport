using System;

namespace ResultApp.Common
{
    public class CommentFilter
    {
        public Guid? MatchId { get; set; }
        public Guid? UserId { get; set; }
        public bool IsActive { get; set; }

        public CommentFilter(Guid? matchId, Guid? userId, bool isActive)
        {
            MatchId = matchId;
            UserId = userId;
            IsActive = isActive;
        }
    }
}
