using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public interface ILocationService
    {
        Task<Location> CreateAsync(Location location);
        Task<bool> ToggleActivateAsync(Guid id);
        Task<PageList<Location>> GetAllAsync(Sorting sorting, Paging paging, LocationFilter locationFilter);
        Task<Location> GetByIdAsync(Guid id);
        Task<Location> UpdateAsync(Guid id, Location location);
    }
}