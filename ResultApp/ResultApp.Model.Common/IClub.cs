using System;

namespace ResultApp.Model
{
    public interface IClub
    {
        Guid Id { get; set; }
        Guid LeagueId { get; set; }
        Guid LocationId { get; set; }
        string Logo { get; set; }
        string Name { get; set; }
    }
}