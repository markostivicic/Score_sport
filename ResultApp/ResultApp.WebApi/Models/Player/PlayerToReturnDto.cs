using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResultApp.Model;
using ResultApp.WebApi.Models.Club;
using ResultApp.WebApi.Models.Country;

namespace ResultApp.WebApi.Models.Player
{
	public class PlayerToReturnDto
	{
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Image { get; set; }
        public DateTime DoB { get; set; }
        public Guid ClubId { get; set; }
        public Guid CountryId { get; set; }
        public ClubToReturnDto Club { get; set; }
        public CountryToReturnDto Country { get; set; }

        public PlayerToReturnDto(Guid id, string firstName, string lastName, string image, DateTime doB, Guid clubId, Guid countryId, ClubToReturnDto club, CountryToReturnDto country)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Image = image;
            DoB = doB;
            ClubId = clubId;
            CountryId = countryId;
            Club = club;
            Country = country;
        }

    }
}