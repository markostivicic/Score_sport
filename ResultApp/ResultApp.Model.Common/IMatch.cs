using System;

namespace ResultApp.Model
{
    public interface IMatch
    {
        int? AwayScore { get; set; }
        Guid ClubAwayId { get; set; }
        Guid ClubHomeId { get; set; }
        int? HomeScore { get; set; }
        Guid Id { get; set; }
        Guid LocationId { get; set; }
        DateTime Time { get; set; }
    }
}