using System;
using System.ComponentModel.DataAnnotations;

namespace ResultApp.WebApi.Models.ClubModels
{
    public class ClubToCreateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Logo { get; set; }
        [Required]
        public Guid LeagueId { get; set; }
        [Required]
        public Guid LocationId { get; set; }

        public ClubToCreateDto(string name, string logo, Guid leagueId, Guid locationId)
        {
            Name = name;
            Logo = logo;
            LeagueId = leagueId;
            LocationId = locationId;
        }
    }
}