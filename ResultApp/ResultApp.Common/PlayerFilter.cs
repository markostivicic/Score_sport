using System;

namespace ResultApp.Common
{
    public class PlayerFilter
    {
        public Guid? ClubId { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
