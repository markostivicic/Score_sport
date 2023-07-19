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
    public class SportService : ISportService
    {
        private readonly ISportRepository _repository;

        public SportService(ISportRepository repository)
        {
            _repository = repository;
        }
        public async Task<PageList<Sport>> GetAllAsync(Sorting sorting, Paging paging, SportFilter sportFilter)
        {
            return await _repository.GetAllAsync(sorting, paging, sportFilter);
        }

        public async Task<Sport> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Sport> CreateAsync(Sport sport)
        {
            return await _repository.CreateAsync(sport);
        }

        public async Task<Sport> UpdateAsync(Guid id, Sport sport)
        {
            return await _repository.UpdateAsync(id, sport);
        }

        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            return await _repository.ToggleActivateAsync(id);
        }
    }
}
