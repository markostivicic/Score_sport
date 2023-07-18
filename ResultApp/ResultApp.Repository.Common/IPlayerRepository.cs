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
        Task<List<Player>> GetPlayersAsync(PlayerFilter filter);
        Task<Player> GetPlayerByIdAsync(Guid id);
        Task<int> UpdatePlayerAsync(Guid id, Player player);
        Task<int> DeletePlayerAsync(Guid id);
    }
}
