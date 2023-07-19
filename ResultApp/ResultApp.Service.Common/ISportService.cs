using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public interface ISportService
    {
        Task<Sport> CreateAsync(Sport sport);
        Task<bool> ToggleActivateAsync(Guid id);
        Task<PageList<Sport>> GetAllAsync(Sorting sorting, Paging paging, SportFilter sportFilter);
        Task<Sport> GetByIdAsync(Guid id);
        Task<Sport> UpdateAsync(Guid id, Sport sport);
    }
}