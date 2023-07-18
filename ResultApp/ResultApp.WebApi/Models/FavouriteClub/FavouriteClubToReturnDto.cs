using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResultApp.WebApi.Models
{
    public class FavouriteClubToReturnDto
    {
        public Guid ClubId { get; set; }
        public string UserId { get; set; }


        public FavouriteClubToReturnDto(Guid clubId, string userId)
        {
            ClubId = clubId;
            UserId = userId;
        }
    }
}