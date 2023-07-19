using System;

namespace ResultApp.WebApi.Models.Player
{
    public class PlayerToCreateAndUpdateDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Image { get; set; }
        public DateTime DoB { get; set; }
        public Guid? ClubId { get; set; }
        public Guid? CountryId { get; set; }

        public PlayerToCreateAndUpdateDto(string firstName, string lastName, string image, DateTime doB, Guid? clubId, Guid? countryId)
        {
            FirstName = firstName;
            LastName = lastName;
            Image = image;
            DoB = doB;
            ClubId = clubId;
            CountryId = countryId;
        }
    }
}