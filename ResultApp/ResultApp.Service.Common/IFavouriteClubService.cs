using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Service.Common
{
    public interface IFavouriteClubService
    {
        Task<PageList<FavouriteClub>> GetAllFavouriteClubsAsync(Sorting sorting, Paging paging, FavouriteClubFilter favouriteClubFilter, string userId);
        Task<int> PostFavouriteClubAsync(FavouriteClub favouriteClub);
        Task<FavouriteClub> GetFavouriteClubByIdAsync(Guid id);
        Task<bool> ToggleActivateAsync(Guid id);
    }
}
