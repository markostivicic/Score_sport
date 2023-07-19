using System;

namespace ResultApp.Model
{
    public interface ILocation
    {
        string Address { get; set; }
        Guid CountryId { get; set; }
        Guid Id { get; set; }
        string Name { get; set; }
    }
}