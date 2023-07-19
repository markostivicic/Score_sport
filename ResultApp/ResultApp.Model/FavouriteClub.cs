using ResultApp.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class FavouriteClub : Base, IFavouriteClub
    {
        public Guid Id { get; set; }
        public Guid ClubId { get; set; }
        public Club Club { get; set; }

        public FavouriteClub(Guid id, Guid clubId, Club club)
        {
            Id = id;
            ClubId = clubId;
            Club = club;
        }

        public FavouriteClub(Guid id, Guid clubId, Club club, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            ClubId = clubId;
            Club = club;
            CreatedByUserId = createdByUserId;
        }

        public FavouriteClub(Guid id, Guid clubId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            ClubId = clubId;
            CreatedByUserId = createdByUserId;
        }

        public FavouriteClub(Guid id, Guid clubId, string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
        {
            Id = id;
            ClubId = clubId;
            UpdatedByUserId = updatedByUserId;
            DateUpdated = dateUpdated;
        }


    }
}
