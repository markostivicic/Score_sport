using System;

namespace ResultApp.Model
{
    public class Comment : Base, IComment
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public Guid MatchId { get; set; }
        public User User { get; set; }

        public Comment(Guid id, string text, Guid matchId, string createdByUserId, User user) : base(createdByUserId)
        {
            Id = id;
            Text = text;
            MatchId = matchId;
            User = user;
        }

        public Comment(Guid id, string text, Guid matchId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            Text = text;
            MatchId = matchId;
        }

        public Comment(Guid id, string text, Guid matchId, string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
        {
            Id = id;
            Text = text;
            MatchId = matchId;
        }
    }
}
