using System;

namespace ResultApp.Model
{
    public interface ISport
    {
        Guid Id { get; set; }
        string Name { get; set; }
    }
}