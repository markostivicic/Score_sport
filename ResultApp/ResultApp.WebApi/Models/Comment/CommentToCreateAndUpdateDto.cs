using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Comment
{
    public class CommentToCreateAndUpdateDto
    {
        public string Text { get; set; }
        public Guid? MatchId { get; set; }

        public CommentToCreateAndUpdateDto(string text, Guid? matchId)
        {
            Text = text;
            MatchId = matchId;
        }
    }
}