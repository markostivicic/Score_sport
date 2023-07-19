using System;

namespace ResultApp.Model
{
    public interface IComment
    {
        Guid Id { get; set; }
        Guid MatchId { get; set; }
        string Text { get; set; }
    }
}