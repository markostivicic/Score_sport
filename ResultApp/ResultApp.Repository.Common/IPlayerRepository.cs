using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResultApp.Common;

namespace ResultApp.Repository.Common
{
    public interface IPlayerRepository
    {
        Task<int> PostPlayerAsync(Player player);
        Task<PageList<Player>> GetPlayersAsync(Sorting sorting, Paging paging, PlayerFilter playerFilter);
        Task<Player> GetPlayerByIdAsync(Guid id);
        Task<int> UpdatePlayerAsync(Guid id, Player player);
        Task<bool> ToggleActivateAsync(Guid id);
    }
}
