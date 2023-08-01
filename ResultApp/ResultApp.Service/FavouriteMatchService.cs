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
    public class FavouriteMatchService : IFavouriteMatchService
    {
        private IFavouriteMatchRepository FavouriteMatchRepository { get; }

        public FavouriteMatchService(IFavouriteMatchRepository favouriteMatchRepository)
        {
            FavouriteMatchRepository = favouriteMatchRepository;
        }

        public async Task<PageList<FavouriteMatch>> GetAllFavouriteMatchsAsync(Sorting sorting, Paging paging, FavouriteMatchFilter favouriteMatchFilter, string userId)
        {
            return await FavouriteMatchRepository.GetAllFavouriteMatchsAsync(sorting, paging, favouriteMatchFilter, userId);
        }
        public async Task<FavouriteMatch> GetFavouriteMatchByIdAsync(Guid id)
        {
            return await FavouriteMatchRepository.GetFavouriteMatchByIdAsync(id);
        }
        public async Task<int> PostFavouriteMatchAsync(FavouriteMatch favouriteMatch)
        {
            return await FavouriteMatchRepository.PostFavouriteMatchAsync(favouriteMatch);
        }

        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            return await FavouriteMatchRepository.ToggleActivateAsync(id);
        }
    }
}

