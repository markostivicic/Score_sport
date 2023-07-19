using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Comment
{
    public class CommentToReturnDto
    {
        public string Text { get; set; }
        public Guid MatchId { get; set; }
        public string UserId { get; set; }
        public UserToReturnDto User { get; set; }

        public CommentToReturnDto(string text, Guid matchId, string userId, UserToReturnDto user)
        {
            Text = text;
            MatchId = matchId;
            UserId = userId;
            User = user;
        }
    }
}