using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ResultApp.Common;

namespace ResultApp.Service.Common
{
    public interface IMatchService
    {
        Task<Match> CreateAsync(Match match);
        Task<bool> ToggleActivateAsync(Guid id);
        Task<PageList<Match>> GetAllAsync(Sorting sorting, Paging paging, MatchFilter matchFilter);
        Task<Match> GetByIdAsync(Guid id);
        Task<Match> UpdateAsync(Guid id, Match match);
    }
}