using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Comment
{
    public class CommentToReturnDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public Guid MatchId { get; set; }
        public string UserId { get; set; }
        public UserToReturnDto User { get; set; }
        public DateTime Time { get; set; }

        public CommentToReturnDto(Guid id, string text, Guid matchId, string userId, UserToReturnDto user, DateTime time)
        {
            Id = id;
            Text = text;
            MatchId = matchId;
            UserId = userId;
            User = user;
            Time = time;
        }
    }
}