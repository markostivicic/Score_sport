using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models.Player
{
	public class PlayerToReturnDto
	{
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Image { get; set; }
        public DateTime DoB { get; set; }
        public Guid ClubId { get; set; }
        public Guid CountryId { get; set; }

        public PlayerToReturnDto(string firstName, string lastName, string image, DateTime doB, Guid clubId, Guid countryId)
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