using System;

namespace ResultApp.Common
{
    public class PlayerFilter
    {
        public string Name { get; set; }
        public Guid? ClubId { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
