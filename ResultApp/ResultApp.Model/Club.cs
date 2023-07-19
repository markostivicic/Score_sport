﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class Club : Base
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public Guid LeagueId { get; set; }
        public Guid LocationId { get; set; }
        public Club(Guid id, string name, string logo, Guid leagueId, Guid locationId)
        {
            Id = id;
            Name = name;
            Logo = logo;
            LeagueId = leagueId;
            LocationId = locationId;
        }
        public Club(Guid id, string name, string logo, Guid leagueId, Guid locationId, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            Name = name;
            Logo = logo;
            LeagueId = leagueId;
            LocationId = locationId;
        }

        public Club(Guid id, string name, string logo, Guid leagueId, Guid locationId, string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
        {
            Id = id;
            Name = name;
            Logo = logo;
            LeagueId = leagueId;
            LocationId = locationId;
        }

    }
}
