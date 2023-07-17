using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ResultApp.Model;
using ResultApp.Common;


namespace ResultApp.Service.Common
{
    public interface IClubService
    {
        Task<List<Club>> GetAllAsync(ClubFilter filter);
        Task<Club> GetByIdAsync(Guid id);
        Task<int> InsertAsync(Club club);
        Task<int> UpdateAsync(Guid id, Club club);
        Task<int> DeleteAsync(Guid id);
    }
}
