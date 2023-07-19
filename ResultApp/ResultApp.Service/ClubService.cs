using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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

        public async Task<PageList<Club>> GetAllAsync(Sorting sorting, Paging paging, ClubFilter clubFilter)
        {
            return await ClubRepository.GetAllAsync(sorting, paging, clubFilter);
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
        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            return await ClubRepository.ToggleActivateAsync(id);
        }
    }
}
