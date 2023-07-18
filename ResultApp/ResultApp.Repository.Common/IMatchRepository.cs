using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Repository.Common
{
    public interface IMatchRepository
    {
        Task<Match> CreateAsync(Match match);
        Task<bool> DeleteAsync(Guid id);
        Task<List<Match>> GetAllAsync();
        Task<Match> GetByIdAsync(Guid id);
        Task<Match> UpdateAsync(Guid id, Match match);
    }
}