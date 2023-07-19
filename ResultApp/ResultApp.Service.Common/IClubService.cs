using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ResultApp.Model;
using ResultApp.Common;


namespace ResultApp.Service.Common
{
    public interface IClubService
    {
        Task<PageList<Club>> GetAllAsync(Sorting sorting, Paging paging, ClubFilter clubFilter);
        Task<Club> GetByIdAsync(Guid id);
        Task<int> InsertAsync(Club club);
        Task<int> UpdateAsync(Guid id, Club club);
        Task<bool> ToggleActivateAsync(Guid id);
    }
}
