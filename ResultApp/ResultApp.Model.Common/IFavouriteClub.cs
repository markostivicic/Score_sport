using System;

namespace ResultApp.Model.Common
{
    public interface IFavouriteClub
    {
        Guid ClubId { get; set; }
        Guid Id { get; set; }
    }
}