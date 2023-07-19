using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Repository
{
    public interface ILocationRepository
    {
        Task<Location> CreateAsync(Location location);
        Task<bool> ToggleActivateAsync(Guid id);
        Task<PageList<Location>> GetAllAsync(Sorting sorting = null, Paging paging = null, LocationFilter locationFilter = null);
        Task<Location> GetByIdAsync(Guid id);
        Task<Location> UpdateAsync(Guid id, Location location);
    }
}