using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Repository.Common
{
    public interface ILeagueRepository
    {
        Task<List<League>> GetAllAsync(LeagueFilter filter);
        Task<League> GetByIdAsync(Guid id);
        Task<int> InsertAsync(League league);
        Task<int> UpdateAsync(Guid id, League league);
        Task<int> DeleteAsync(Guid id);
    }
}
