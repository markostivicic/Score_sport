using System;

namespace ResultApp.Model
{
    public interface ILeague
    {
        Guid CountryId { get; set; }
        Guid Id { get; set; }
        string Name { get; set; }
        Guid SportId { get; set; }
    }
}