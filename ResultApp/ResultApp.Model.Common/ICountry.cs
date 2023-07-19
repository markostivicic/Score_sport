using System;

namespace ResultApp.Model
{
    public interface ICountry
    {
        Guid Id { get; set; }
        string Name { get; set; }
    }
}