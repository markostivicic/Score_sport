using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Repository;
using ResultApp.Repository.Common;
using ResultApp.Service.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class FavouriteClubService : IFavouriteClubService
    {
        private IFavouriteClubRepository FavouriteClubRepository { get; }

        public FavouriteClubService(IFavouriteClubRepository favouriteClubRepository)
        {
            FavouriteClubRepository = favouriteClubRepository;
        }

        public async Task<List<FavouriteClub>> GetAllFavouriteClubsAsync(FavouriteClubFilter filter)
        {
            return await FavouriteClubRepository.GetAllFavouriteClubsAsync(filter);
        }
        public async Task<FavouriteClub> GetFavouriteClubByIdAsync(Guid id)
        {
            return await FavouriteClubRepository.GetFavouriteClubByIdAsync(id);
        }
        public async Task<int> PostFavouriteClubAsync(FavouriteClub favouriteClub)
        {
            return await FavouriteClubRepository.PostFavouriteClubAsync(favouriteClub);
        }

        public async Task<int> DeleteFavouriteClubAsync(Guid id)
        {
            return await FavouriteClubRepository.DeleteFavouriteClubAsync(id);
        }
    }
}

