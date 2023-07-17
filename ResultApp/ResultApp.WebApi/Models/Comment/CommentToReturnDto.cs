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
        

        public CommentToReturnDto(string text, Guid matchId, string userId)
        {
            Text = text;
            MatchId = matchId;
            UserId = userId;
        }
    }
}