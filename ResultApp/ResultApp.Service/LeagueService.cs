using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Repository.Common;
using System;
using System.Collections.Generic;
using ResultApp.Service.Common;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class LeagueService : ILeagueService
    {
        private ILeagueRepository LeagueRepository { get; }

        public LeagueService(ILeagueRepository leagueRepository)
        {
            LeagueRepository = leagueRepository;
        }

        public async Task<PageList<League>> GetAllAsync(Sorting sorting, Paging paging, LeagueFilter leagueFilter)
        {
            return await LeagueRepository.GetAllAsync(sorting, paging, leagueFilter);
        }
        public async Task<League> GetByIdAsync(Guid id)
        {
            return await LeagueRepository.GetByIdAsync(id);
        }
        public async Task<int> InsertAsync(League league)
        {
            return await LeagueRepository.InsertAsync(league);
        }
        public async Task<int> UpdateAsync(Guid id, League league)
        {
            return await LeagueRepository.UpdateAsync(id, league);
        }
        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            return await LeagueRepository.ToggleActivateAsync(id);
        }
    }
}
