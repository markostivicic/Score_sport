using System;
using System.Collections.Generic;
using ResultApp.Model;
using System.Threading.Tasks;
using ResultApp.Common;

namespace ResultApp.Repository.Common
{
    public interface IClubRepository
    {
        Task<PageList<Club>> GetAllAsync(Sorting sorting, Paging paging, ClubFilter clubFilter);
        Task<Club> GetByIdAsync(Guid id);
        Task<int> InsertAsync(Club club);
        Task<int> UpdateAsync(Guid id, Club club);
        Task<bool> ToggleActivateAsync(Guid id);
    }
}
