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
        Task<bool> ToggleActivateAsync(Guid id);
        Task<PageList<Sport>> GetAllAsync(Sorting sorting = null, Paging paging = null, SportFilter sportFilter = null);
        Task<Sport> GetByIdAsync(Guid id);
        Task<Sport> UpdateAsync(Guid id, Sport sport);
    }
}