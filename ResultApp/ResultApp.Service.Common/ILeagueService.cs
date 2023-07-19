using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Service.Common
{
    public interface ILeagueService
    {
        Task<PageList<League>> GetAllAsync(Sorting sorting, Paging paging, LeagueFilter leagueFilter);
        Task<League> GetByIdAsync(Guid id);
        Task<int> InsertAsync(League league);
        Task<int> UpdateAsync(Guid id, League league);
        Task<bool> ToggleActivateAsync(Guid id);
    }
}
