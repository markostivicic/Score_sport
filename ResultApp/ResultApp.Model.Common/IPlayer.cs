using System;

namespace ResultApp.Model.Common
{
    public interface IPlayer
    {
        Guid ClubId { get; set; }
        Guid CountryId { get; set; }
        DateTime DoB { get; set; }
        string FirstName { get; set; }
        Guid Id { get; set; }
        string Image { get; set; }
        string LastName { get; set; }
    }
}