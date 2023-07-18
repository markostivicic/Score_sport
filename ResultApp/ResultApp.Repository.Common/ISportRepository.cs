using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Repository
{
    public interface ISportRepository
    {
        Task<Sport> CreateAsync(Sport sport);
        Task<bool> DeleteAsync(Guid id);
        Task<List<Sport>> GetAllAsync(SportFilter sportFilter = null);
        Task<Sport> GetByIdAsync(Guid id);
        Task<Sport> UpdateAsync(Guid id, Sport sport);
    }
}