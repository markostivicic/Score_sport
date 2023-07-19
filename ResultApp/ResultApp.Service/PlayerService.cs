using ResultApp.Model;
using ResultApp.Repository.Common;
using ResultApp.Service.Common;
using ResultApp.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class PlayerService : IPlayerService
    {
        private IPlayerRepository PlayerRepository { get; }

        public PlayerService(IPlayerRepository playerRepository)
        {
            PlayerRepository = playerRepository;
        }

        public async Task<PageList<Player>> GetPlayersAsync(Sorting sorting, Paging paging, PlayerFilter playerFilter)
        {
            return await PlayerRepository.GetPlayersAsync(sorting, paging, playerFilter);
        }
        public async Task<Player> GetPlayerByIdAsync(Guid id)
        {
            return await PlayerRepository.GetPlayerByIdAsync(id);
        }
        public async Task<int> PostPlayerAsync(Player player)
        {
            return await PlayerRepository.PostPlayerAsync(player);
        }
        public async Task<int> UpdatePlayerAsync(Guid id, Player player)
        {
            return await PlayerRepository.UpdatePlayerAsync(id, player);
        }
        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            return await PlayerRepository.ToggleActivateAsync(id);
        }

    }
}
