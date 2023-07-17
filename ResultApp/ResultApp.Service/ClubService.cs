using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Praksa.Common;
using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Repository.Common;
using ResultApp.Service.Common;

namespace ResultApp.Service
{
    public class ClubService : IClubService
    {
        private IClubRepository ClubRepository { get; }

        public ClubService(IClubRepository clubRepository)
        {
            ClubRepository = clubRepository;
        }

        public async Task<List<Club>> GetAllAsync(ClubFilter filter)
        {
            return await ClubRepository.GetAllAsync(filter);
        }
        public async Task<Club> GetByIdAsync(Guid id)
        {
            return await ClubRepository.GetByIdAsync(id);
        }
        public async Task<int> InsertAsync(Club club)
        {
            return await ClubRepository.InsertAsync(club);
        }
        public async Task<int> UpdateAsync(Guid id, Club club)
        {
            return await ClubRepository.UpdateAsync(id, club);
        }
        public async Task<int> DeleteAsync(Guid id)
        {
            return await ClubRepository.DeleteAsync(id);
        }
    }
}
