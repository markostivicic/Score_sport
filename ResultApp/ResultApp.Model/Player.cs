using ResultApp.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;

namespace ResultApp.Model
{
    public class Player : Base, IPlayer
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Image { get; set; }
        public DateTime DoB { get; set; }
        public Guid ClubId { get; set; }
        public Guid CountryId { get; set; }
        public Club Club { get; set; }
        public Country Country { get; set; }

        public Player(Guid id, string firstName, string lastName, string image, DateTime doB, Guid clubId, Guid countryId)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            DoB = doB;
            Image = image;
            ClubId = clubId;
            CountryId = countryId;
        }
        public Player(Guid id, string firstName, string lastName, string image, DateTime doB, Guid clubId, Guid countryId, Club club, Country country)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            DoB = doB;
            Image = image;
            ClubId = clubId;
            CountryId = countryId;
            Club = club;
            Country = country;
        }

        public Player(Guid id, string firstName, string lastName, string image, DateTime doB, Guid clubId, Guid countryId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            DoB = doB;
            Image = image;
            ClubId = clubId;
            CountryId = countryId;
            CreatedByUserId = createdByUserId;
        }

        public Player(Guid id, string firstName, string lastName, string image, DateTime doB, Guid clubId, Guid countryId, string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            DoB = doB;
            Image = image;
            ClubId = clubId;
            CountryId = countryId;
            UpdatedByUserId = updatedByUserId;
            DateUpdated = dateUpdated;
        }
    }
}
