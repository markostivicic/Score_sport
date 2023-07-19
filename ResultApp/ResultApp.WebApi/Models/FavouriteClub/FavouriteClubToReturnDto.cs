using ResultApp.WebApi.Models.Club;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models
{
    public class FavouriteClubToReturnDto
    {
        public Guid Id { get; set; }
        public Guid ClubId { get; set; }
        public string UserId { get; set; }
        public ClubToReturnDto Club { get; set; }

        public FavouriteClubToReturnDto(Guid id, Guid clubId, string userId, ClubToReturnDto club)
        {
            Id = id;
            ClubId = clubId;
            UserId = userId;
            Club = club;
        }
    }
}