﻿using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Threading.Tasks;

namespace ResultApp.Repository.Common
{
    public interface IFavouriteMatchRepository
    {
        Task<PageList<FavouriteMatch>> GetAllFavouriteMatchsAsync(Sorting sorting, Paging paging, FavouriteMatchFilter favouriteMatchFilter, string userId);
        Task<FavouriteMatch> GetFavouriteMatchByIdAsync(Guid id);
        Task<int> PostFavouriteMatchAsync(FavouriteMatch favouriteMatch);
        Task<bool> ToggleActivateAsync(Guid id);
    }
}