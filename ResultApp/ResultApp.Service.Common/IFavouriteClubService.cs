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
        Task<List<FavouriteClub>> GetAllFavouriteClubsAsync(FavouriteClubFilter filter);
        Task<int> PostFavouriteClubAsync(FavouriteClub favouriteClub);
        Task<FavouriteClub> GetFavouriteClubByIdAsync(Guid id);
        Task<int> DeleteFavouriteClubAsync(Guid id);
    }
}
