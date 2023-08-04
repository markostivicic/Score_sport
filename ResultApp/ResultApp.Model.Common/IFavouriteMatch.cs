using System;

namespace ResultApp.Model.Common
{
    public interface IFavouriteMatch
    {
        Guid Id { get; set; }
        Guid MatchId { get; set; }
    }
}