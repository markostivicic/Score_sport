using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class LocationService : ILocationService
    {
        private readonly ILocationRepository _repository;

        public LocationService(ILocationRepository repository)
        {
            _repository = repository;
        }
        public async Task<PageList<Location>> GetAllAsync(Sorting sorting, Paging paging, LocationFilter locationFilter)
        {
            return await _repository.GetAllAsync(sorting, paging, locationFilter);
        }

        public async Task<Location> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Location> CreateAsync(Location location)
        {
            return await _repository.CreateAsync(location);
        }

        public async Task<Location> UpdateAsync(Guid id, Location location)
        {
            return await _repository.UpdateAsync(id, location);
        }

        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            return await _repository.ToggleActivateAsync(id);
        }
    }
}
